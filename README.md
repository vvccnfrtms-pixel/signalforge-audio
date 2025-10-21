# SignalForge Audio (website)

Static website for SignalForge Audio — boutique guitar pedals.

## Deploy
1. Push this repo to GitHub, enable GitHub Pages from `main` branch (or configure `gh-pages`).
2. Optional: Add `CNAME` file with your domain.
3. Replace product links with your PayPal/Gumroad/Stripe endpoints.

## E-commerce options
- **Immediate (static):** Use PayPal.me, PayPal buttons or Gumroad links in `assets/data/products.json`.
- **Scalable (recommended):** Add Stripe Checkout via a serverless function (Netlify Functions, Vercel Serverless, or AWS Lambda). Update `assets/js/shop.js` to call your endpoint.

## Notes
- Replace placeholder images and product details
- Add analytics & pixel IDs in templates
- Secure your Stripe secret keys only on the server side
