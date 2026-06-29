# Stephanie — Social Media Portfolio

A modern, responsive one-page portfolio for a social media manager / content creator. Pure HTML, CSS, and JavaScript — no build step, no dependencies.

## Run it

Just open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Files

- `index.html` — page structure and all content
- `styles.css` — theme, layout, animations (edit the `:root` tokens to recolor)
- `script.js` — nav, scroll reveals, work filters, stat counters, demo contact form

## Make it yours

All content is placeholder — search `index.html` and replace:

- **Name & handle**: `Stephanie`, `@stephcreates`
- **Social links**: the `href="#"` links in the hero, nav, and footer
- **Work cards**: titles, descriptions, and metrics in the `#workGrid` section
- **Stats**: `data-count` / `data-suffix` attributes in the Results section
- **Testimonials**: the `<blockquote>` text
- **Contact email**: `hello@stephcreates.com`
- **Colors**: the `--brand`, `--brand-2`, `--grad` variables at the top of `styles.css`

### Swap placeholder visuals for real media

The work cards and phone mockup use CSS gradients as stand-ins. Replace a card's
`.card__media` div with an `<img>` or `<video>` to show real content.

### Make the contact form actually send

The form is a front-end demo. To receive messages, point it at a service like
[Formspree](https://formspree.io): set the `<form>` `action` to your endpoint,
`method="POST"`, and remove the demo handler in `script.js`.
