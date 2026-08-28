# Shipfront · THE NETWORK

Friday Terminal lock on the live 3-pager. Black ground, white type, one
Kunal cube, one accent. No new pages. Stills are not generated or replaced.

Static HTML, CSS and vanilla JS. No build step, no dependencies, no backend.

## Lock

- Ground `#000000`. Type `#FFFFFF`. One accent `#FF6A00`.
- Accent lives only on the wordmark cube and Get a Quote. CTA label is `#000`
  on the accent.
- Cube is Kunal hex + inner Y (stem down), fill `#000`, square caps, miter.
  Not a pip. Not `32x36` / `M16 3.2`. Not the tilted yaw mark.
- Value props stay Warehousing, Fulfillment, eCommerce Integrations, Location.
- Copy stays [myshipfront.com](https://myshipfront.com/) live copy. Reef is the
  address at 1933 S. Broadway, Los Angeles, CA 90007. No invented phone.
- Get a Quote form is Name, Email, Company only. Preview, no backend.
- Footer exact line: Built by David T Phung.
- No em dashes. No cartoons. No new pages.

## Pages

| Page          | File               |
| ------------- | ------------------ |
| Home          | `index.html`       |
| Get a Quote   | `get-a-quote.html` |
| Contact       | `contact.html`     |

## Type

Space Grotesk carries display, headings, body, and UI. JetBrains Mono is only
for true numerals and codes. No Inter, no serif, no second display face.

## Capabilities tiles

The four capabilities are image-led tiles. The stills are the shared Shipfront
frames, copied byte for byte. Do not recode them.

If `assets/images/` is empty after a fresh clone, run:

```bash
bash scripts/fetch-stills.sh
```

It pins every frame to a sha1 and byte count and refuses to write anything
that does not match. The publish workflow runs the same script before deploying.

Live: <https://davidtphung.github.io/shipfront-the-network/>

## Run it locally

Any static file server works. With Python installed:

```bash
python3 -m http.server 43317
```

Then open <http://127.0.0.1:43317>.

## Deploying

GitHub Pages serves the site from the `gh-pages` branch. The workflow in
`.github/workflows/pages.yml` mirrors `main` onto `gh-pages` on every push.
Do not merge this lock into `main` unless you intend that mirror.

## How THE NETWORK behaves

- **Scroll selects, time animates.** Scroll position through the section picks
  the active stage. The order token is driven by time, not by scroll.
- **One pass, then a low energy loop.** The token runs the full route once when
  the section scrolls into view, then settles into a slower, dimmer loop.
- **Pauses offscreen.** An `IntersectionObserver` stops the animation frame
  loop whenever the section leaves the viewport.
- **Keyboard parity.** Every node is focusable and exposes the same copy that
  hover and tap reveal.
- **Reduced motion.** The sticky journey flattens, the route is drawn fully
  lit, all six descriptions stack, and the traveling token is removed.
- **Compositor only.** Animated properties are limited to `transform` and
  `opacity`.
- **Mobile.** Below the desktop breakpoint the graph becomes a vertical stepped
  route with all copy visible at once.

The graph is illustrative and is labeled as such. It is not a live tracker and
carries no live customer data.

Built by David T Phung.
