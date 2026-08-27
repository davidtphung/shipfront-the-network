/* Site chrome: mobile nav sheet, scroll reveals, quote form preview. */

(function () {
  "use strict";

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

  /* ---------------- mobile nav sheet ---------------- */

  var toggle = document.querySelector("[data-nav-toggle]");
  var sheet = document.querySelector("[data-nav-sheet]");

  if (toggle && sheet) {
    var setOpen = function (open) {
      sheet.setAttribute("data-open", open ? "true" : "false");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.querySelector("[data-nav-label]").textContent = open
        ? "Close"
        : "Menu";
    };

    setOpen(false);

    toggle.addEventListener("click", function () {
      setOpen(sheet.getAttribute("data-open") !== "true");
    });

    sheet.addEventListener("click", function (event) {
      if (event.target.closest("a")) setOpen(false);
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && sheet.getAttribute("data-open") === "true") {
        setOpen(false);
        toggle.focus();
      }
    });
  }

  /* ---------------- scroll reveals ---------------- */

  var targets = Array.prototype.slice.call(
    document.querySelectorAll("[data-reveal]")
  );

  if (!targets.length) return;

  if (reduced.matches || !("IntersectionObserver" in window)) {
    targets.forEach(function (element) {
      element.setAttribute("data-in", "true");
    });
  } else {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.setAttribute("data-in", "true");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
    );

    targets.forEach(function (element, index) {
      var group = element.closest("[data-reveal-group]");
      if (group) {
        var siblings = Array.prototype.slice.call(
          group.querySelectorAll("[data-reveal]")
        );
        element.style.setProperty(
          "--reveal-delay",
          Math.min(siblings.indexOf(element), 5) * 70 + "ms"
        );
      }
      observer.observe(element);
    });
  }
})();

/* ---------------- quote form preview ---------------- */

(function () {
  "use strict";

  var form = document.querySelector("[data-preview-form]");
  if (!form) return;

  var result = form.querySelector("[data-preview-result]");

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    if (!result) return;
    result.setAttribute("data-shown", "true");
    result.focus();
  });
})();
