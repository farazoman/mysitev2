# Faraz Oman — interactive résumé

A personal career timeline with an interactive terminal introduction, a walking pixel-art character, role milestones, and a skills field guide. The site is a static HTML, CSS, and JavaScript application housed in the existing Create React App project.

Use the terminal's command buttons or type `help`, `aboutme`, `resume`, `skills`, `contact`, `linkedin`, or `clear`. The terminal runs entirely in the browser; it is not a system shell.

## Run locally

For a quick preview with Python, from the repository root:

```sh
python3 -m http.server 4173 --directory my-site/public
```

Open `http://localhost:4173`. No Node dependencies are needed for this static preview.

For the existing Create React App workflow:

```sh
cd my-site
npm ci
npm start
```

The development server normally opens at `http://localhost:3000`.

## Build and deploy

From `my-site`, run `npm run build`. The resulting `my-site/build/` directory contains the static site and can be published to a static hosting provider. Configure the host to serve `index.html` and the accompanying assets together. This repository does not currently contain an automated deployment workflow, so pushing to GitHub alone does not publish the site.

The project uses Create React App 4 and an older dependency lockfile. On newer Node versions, if the build reports an OpenSSL compatibility error, try a compatible Node version or `NODE_OPTIONS=--openssl-legacy-provider npm run build`.

## Project layout

- `my-site/public/index.html` — page structure and timeline markup.
- `my-site/public/terminal-hero.js` and `terminal-hero.css` — terminal commands and presentation.
- `my-site/public/blue-hour.css` — site-wide color palette.
- `my-site/public/app-*.js` — timeline data and interactions.
- `my-site/public/style-*.css` and `mobile-jumps-*.css` — responsive styling.
- `my-site/public/assets/skills/` — local skill icons and their license.
- `my-site/public/vendor/` — locally served jQuery and jQuery Terminal assets and their licenses; the terminal does not depend on a third-party CDN.
- `my-site/src/index.js` — intentionally minimal entry point for Create React App.

The first Amadeus internship year is marked approximate pending confirmation. Career details and skills should be reviewed before sharing publicly.
