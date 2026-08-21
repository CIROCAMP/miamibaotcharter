# charterboatmiami.net

Marketing site for private yacht charters in Miami aboard **VERVE** — a **2024 Azimut Verve 48**.

Static site: plain HTML, CSS and vanilla JS. No build step, no dependencies.

```
index.html            single-page site
assets/css/styles.css all styling
assets/js/main.js     nav, scroll reveals, booking form  ← contact details live here
assets/img/*.svg      placeholder artwork (replace with photos)
robots.txt sitemap.xml vercel.json
```

## Run locally

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## ⚠️ Before you go live — replace the placeholders

Everything below is a placeholder I filled in so the page reads properly. **Check each one.**

| What | Where | Current placeholder |
|---|---|---|
| Phone | `assets/js/main.js` → `CONTACT.phone` / `.phoneRaw` | `+1 (305) 000-0000` |
| WhatsApp | `assets/js/main.js` → `CONTACT.whatsapp` | `13050000000` |
| Email | `assets/js/main.js` → `CONTACT.email` | `hello@charterboatmiami.net` |
| Marina / departure point | `assets/js/main.js` → `CONTACT.marina` | Miami Beach Marina, 300 Alton Rd |
| **Charter rates** | `index.html`, `.card-price` in the Charters section | $1,450 / $2,400 / $3,400 / $4,600 |
| Charter durations & inclusions | `index.html`, Charters section | 2 / 4 / 6 / 8 hr |
| Deposit & cancellation wording | `index.html`, FAQ | generic terms |
| Postal address in structured data | `index.html`, the `application/ld+json` block | 300 Alton Road |

The contact details in `main.js` are injected into every `[data-contact]` element on the page,
so changing them in that one object updates the header, the booking panel, the CTA strip and
the footer at once. The `tel:` and `mailto:` hrefs written into `index.html` are fallbacks for
visitors with JavaScript disabled — update those too, or leave them, since JS overwrites them.

**Rates, hours and terms are placeholders, not quotes.** They need your real numbers before
the site is public.

## Photography

`assets/img/*.svg` are generated placeholder scenes, not photographs. Drop real photos in with
the same base names (`hero.jpg`, `gallery-1.jpg`, …) and update the `src` attributes in
`index.html` plus the `--hero` background in `styles.css`. Suggested shots:

- **hero** — the boat running, wide, low sun, skyline behind
- **yacht-profile** — clean profile at speed
- **gallery** — beach club at anchor, bow sunpad, sandbar raft-up, cockpit wet bar, interior, sunset

Aim for ~2400px wide, compressed to under 400 KB each, and use `.webp` where you can.

## Booking form

By default the form opens the visitor's mail client with the enquiry pre-filled, and the
WhatsApp button opens a chat with the same text. That works with zero backend.

To receive enquiries as email instead, create a form endpoint (Formspree, Basin, Netlify Forms,
your own handler) and set:

```js
formEndpoint: 'https://formspree.io/f/xxxxxxxx'
```

in `CONTACT` at the top of `assets/js/main.js`. The form then POSTs there and shows an inline
confirmation.

## Deploy

**Vercel** — import the repo, framework preset *Other*, no build command, output directory `.`.
`vercel.json` sets caching and security headers.

**Netlify / Cloudflare Pages** — same idea: no build command, publish directory `.`.

Then point `charterboatmiami.net` at the deployment and add the `www` redirect. Update the
canonical URL and Open Graph tags in `index.html` if the final domain differs.

## Boat specifications

Specs in the site come from published figures for the Azimut Verve 48: 49'4" LOA, 13'5" beam,
4'3" draft, 3 × Mercury Verado 600 hp, up to ~50 knots, 618 gal fuel / 79 gal water,
two cabins sleeping four, up to 12 guests for a day charter. Confirm against your own vessel's
documentation and its Certificate of Inspection before publishing a guest count.
