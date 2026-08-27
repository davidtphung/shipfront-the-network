# Shipfront · THE NETWORK

A black-ground editorial site for Shipfront, a warehousing and fulfillment
operation in downtown Los Angeles. The signature object of the site is
`#network`: an illustrative six stage fulfillment route (Store, Inventory,
Fulfillment, Quality check, Carrier, Customer) rendered as a sticky, keyboard
navigable node graph with a traveling order token.

Static HTML, CSS and vanilla JS. No build step, no dependencies, no backend.

## Paint

The ground is true black `#000000`. Each section lays a subtle wash of that
same black over it, a radial lift to about `#131313` and back down, plus a
whisper of warm at the far edge like heat on a dock. There is no colour field.

Warm `#cf8f5c` is an accent, never a surface. It carries the section eyebrows,
one filled call to action, the active node, and the lit route hairline.
Everything else, including the progress meter, the stage tags and the routes
strip, is neutral white on black. A pixel sample of a rendered viewport reads
an average of about `rgb(19, 18, 17)` with zero blue dominant pixels.

## Capabilities tiles

The four capabilities are image led tiles: clipped still first, then a numeric
index, the live heading, the verbatim live body, and a single Get a Quote path.
The stills are the shared Shipfront frames also used on the sibling site and
are copied here byte for byte, not recoded. They carry the luminance so the
page can stay black without a paper section.

If `assets/images/` is empty after a fresh clone, run:

```bash
bash scripts/fetch-stills.sh
```

It pins every frame to a sha1 and byte count and refuses to write anything
that does not match, so the frames can never be silently recoded. The publish
workflow runs the same script before deploying.

Live: <https://davidtphung.github.io/shipfront-the-network/>

## Pages

| Page          | File               |
| ------------- | ------------------ |
| Home          | `index.html`       |
| Get a Quote   | `get-a-quote.html` |
| Contact       | `contact.html`     |

## Run it locally

Any static file server works. With Python installed:

```bash
python3 -m http.server 43317
```

Then open <http://127.0.0.1:43317>.

## Deploying

GitHub Pages serves the site from the `gh-pages` branch. The workflow in
`.github/workflows/pages.yml` mirrors `main` onto `gh-pages` on every push, so
publishing is just a push to `main`.

## How THE NETWORK behaves

- **Scroll selects, time animates.** Scroll position through the section picks
  the active stage. The order token is driven by time, not by scroll, so the
  page never hijacks or rubber bands the scroll.
- **One pass, then a low energy loop.** The token runs the full route once when
  the section scrolls into view, then settles into a slower, dimmer loop.
- **Pauses offscreen.** An `IntersectionObserver` stops the animation frame
  loop whenever the section leaves the viewport.
- **Keyboard parity.** Every node is focusable and exposes the same copy that
  hover and tap reveal, via `aria-describedby` on the node and a persistent
  description panel. Arrow keys move along the route. Nothing is hover only.
- **Reduced motion.** With `prefers-reduced-motion: reduce`, the sticky journey
  flattens, the route is drawn fully lit, all six descriptions stack, and the
  traveling token is removed entirely.
- **Compositor only.** Animated properties are limited to `transform` and
  `opacity`. Presses use a critically damped curve to `scale(0.97)`.
- **Mobile.** Below the desktop breakpoint the graph becomes a vertical stepped
  route with all copy visible at once.
- **No hover only meaning.** Keyboard reads exactly what hover and tap reveal,
  on the node graph and on the capability tiles. There is no `role="tab"`
  anywhere; hover on a tile only scales its still.

The graph is illustrative and is labeled as such. It is not a live tracker and
carries no live customer data.

## Content

Customer-facing service copy is preserved verbatim from the live Shipfront site
(`myshipfront.com`, `/get-a-quote`, `/contact`). No metrics, warehouse counts,
coverage maps, delivery estimates, or phone numbers have been invented. The
Get a Quote form is a design preview: it does not submit and there is no CRM
behind it.

Built by David T Phung.
