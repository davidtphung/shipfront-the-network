/* THE NETWORK
 *
 * Scroll position selects the active node. Time drives the order token:
 * one full pass on scroll-into-view, then a low energy loop. The token
 * pauses whenever the section leaves the viewport.
 *
 * Nothing here hijacks scroll and nothing animates a property other than
 * transform or opacity. Under prefers-reduced-motion the graph is drawn
 * fully lit and static, with no traveling token.
 */

(function () {
  "use strict";

  var section = document.querySelector("[data-network]");
  if (!section) return;

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

  var nodes = Array.prototype.slice.call(
    section.querySelectorAll("[data-node]")
  );
  var segments = Array.prototype.slice.call(
    section.querySelectorAll("[data-seg]")
  );
  var panels = Array.prototype.slice.call(
    section.querySelectorAll("[data-panel]")
  );
  var railFill = section.querySelector("[data-rail-fill]");
  var railNow = section.querySelector("[data-rail-now]");
  var route = section.querySelector("[data-route]");
  var token = section.querySelector("[data-token]");
  var mToken = section.querySelector("[data-mtoken]");
  var steps = section.querySelector("[data-steps]");

  var count = nodes.length;
  if (!count) return;

  /* ---------------- active node ---------------- */

  var active = -1;

  function setActive(index) {
    index = Math.max(0, Math.min(count - 1, index));
    if (index === active) return;
    active = index;

    for (var i = 0; i < count; i++) {
      var on = i === index;
      nodes[i].setAttribute("data-active", on ? "true" : "false");
      nodes[i].setAttribute("aria-pressed", on ? "true" : "false");
      if (panels[i]) panels[i].setAttribute("data-active", on ? "true" : "false");
    }

    for (var s = 0; s < segments.length; s++) {
      segments[s].setAttribute("data-lit", index > s ? "true" : "false");
    }

    if (railNow) railNow.textContent = pad(index + 1);
  }

  function pad(n) {
    return n < 10 ? "0" + n : String(n);
  }

  /* Hover, tap and keyboard all resolve to the same state, so no meaning
     is locked behind a pointer. */
  nodes.forEach(function (node, i) {
    node.addEventListener("pointerenter", function () {
      setActive(i);
    });
    node.addEventListener("focus", function () {
      setActive(i);
    });
    node.addEventListener("click", function () {
      setActive(i);
    });
    node.addEventListener("keydown", function (event) {
      var key = event.key;
      if (key === "Enter" || key === " " || key === "Spacebar") {
        event.preventDefault();
        setActive(i);
        return;
      }
      var delta =
        key === "ArrowRight" || key === "ArrowDown"
          ? 1
          : key === "ArrowLeft" || key === "ArrowUp"
          ? -1
          : 0;
      if (!delta) return;
      event.preventDefault();
      var next = (i + delta + count) % count;
      nodes[next].focus();
      setActive(next);
    });
  });

  setActive(0);

  /* ---------------- scroll driven journey ---------------- */

  var scrollIndex = 0;
  var ticking = false;

  function readScroll() {
    ticking = false;
    var rect = section.getBoundingClientRect();
    var travel = rect.height - window.innerHeight;
    var progress =
      travel > 0 ? clamp(-rect.top / travel, 0, 1) : rect.top < 0 ? 1 : 0;

    if (railFill) {
      railFill.style.transform = "scaleX(" + progress.toFixed(4) + ")";
    }

    var index = clamp(Math.floor(progress * count), 0, count - 1);
    if (index !== scrollIndex) {
      scrollIndex = index;
      setActive(index);
    }
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(readScroll);
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  readScroll();

  /* ---------------- order token ---------------- */

  var INTRO_MS = 4200;
  var LOOP_MS = 11000;
  var LOOP_OPACITY = 0.45;

  var length = 0;
  var phase = "intro";
  var started = 0;
  var playing = false;
  var frame = 0;
  var elapsed = 0;

  function measure() {
    if (route && route.getTotalLength) {
      try {
        length = route.getTotalLength();
      } catch (error) {
        length = 0;
      }
    }
  }

  function place(t) {
    if (token && length) {
      var point = route.getPointAtLength(t * length);
      token.setAttribute(
        "transform",
        "translate(" + point.x.toFixed(2) + " " + point.y.toFixed(2) + ")"
      );
    }
    if (mToken && steps) {
      var span = steps.offsetHeight - 96;
      if (span > 0) {
        mToken.style.transform = "translateY(" + (t * span).toFixed(1) + "px)";
      }
    }
  }

  function opacity(value) {
    if (token) token.style.opacity = String(value);
    if (mToken) mToken.style.opacity = String(value);
  }

  function tick(now) {
    if (!playing) return;
    var duration = phase === "intro" ? INTRO_MS : LOOP_MS;
    var t = clamp((now - started) / duration, 0, 1);
    elapsed = t;

    place(phase === "intro" ? easeInOutCubic(t) : t);
    opacity(phase === "intro" ? fadeEnds(t) : LOOP_OPACITY * fadeEnds(t));

    if (t >= 1) {
      phase = "loop";
      started = now;
    }
    frame = requestAnimationFrame(tick);
  }

  function play() {
    if (playing || reduced.matches) return;
    playing = true;
    if (!length) measure();
    started = performance.now() - elapsed * (phase === "intro" ? INTRO_MS : LOOP_MS);
    frame = requestAnimationFrame(tick);
  }

  function pause() {
    playing = false;
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
  }

  function fadeEnds(t) {
    /* keeps the token from popping in or out at the route ends */
    if (t < 0.06) return t / 0.06;
    if (t > 0.94) return (1 - t) / 0.06;
    return 1;
  }

  function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  function clamp(value, min, max) {
    return value < min ? min : value > max ? max : value;
  }

  function applyMotionMode() {
    if (reduced.matches) {
      pause();
      opacity(0);
      for (var s = 0; s < segments.length; s++) {
        segments[s].setAttribute("data-lit", "true");
      }
      section.setAttribute("data-playing", "false");
      return;
    }
    measure();
  }

  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        var visible = entries[0].isIntersecting;
        section.setAttribute("data-playing", visible ? "true" : "false");
        if (visible) play();
        else pause();
      },
      { threshold: 0.08 }
    );
    observer.observe(section);
  } else {
    section.setAttribute("data-playing", "true");
    play();
  }

  window.addEventListener("resize", measure);
  if (reduced.addEventListener) {
    reduced.addEventListener("change", applyMotionMode);
  }

  applyMotionMode();
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(measure);
  }
})();
