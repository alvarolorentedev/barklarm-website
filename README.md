# Barklarm website

The Barklarm website is a static Astro site with Starlight documentation.

## Develop

Use Node.js 24 and Python 3.

```sh
npm ci
npm run dev
```

To test the production build, including Pagefind search:

```sh
npm run build
npm run check
npm run preview
```

Documentation lives in `src/content/docs/docs`. Blog posts live in `blog`. Public images, video, and other files live in `public`.

The GitHub Actions workflow checks pull requests and publishes `dist` to GitHub Pages when changes land on `main`. Astro writes individual HTML files so the existing extensionless URLs continue to work on Pages.
