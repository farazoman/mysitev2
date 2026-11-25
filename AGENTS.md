# Agent instructions

## App overview

The current site is the 2D interactive résumé in `my-site/public/`. The previous React terminal app in `my-site/src/App.js` is legacy code and is not the active page. `src/index.js` is intentionally minimal so Create React App can still build and serve `public/index.html`.

- `public/index.html` contains the page structure and references the fingerprinted JS and CSS files.
- `public/app-*.js` owns résumé data, milestones, sprite movement, path progress, and mobile Helix walkthrough.
- `public/style-*.css` and `public/mobile-jumps-*.css` own responsive layouts and controls.
- `public/assets/skills/` contains local skill SVGs and their license; keep assets and their attribution together.

Keep changes grounded in the owner’s supplied résumé and instructions. Do not invent career dates, role-to-skill associations, or achievements. The first Amadeus internship year is approximate and must remain labelled until confirmed. Preserve the plain background, 2D curved path, accessible direct milestone navigation, responsive layouts, and reduced-motion behavior unless the user asks otherwise.

## Development and checks

A dependency-free local preview from the repository root is:

```sh
python3 -m http.server 4173 --directory my-site/public
```

For the existing CRA workflow, run `cd my-site && npm ci`, then `npm start` or `npm run build`. `build/` is generated and gitignored. CRA 4 and its older lockfile may need a compatible Node version or `NODE_OPTIONS=--openssl-legacy-provider` for an OpenSSL build error. Do not silently update dependencies as part of unrelated edits.

Check JavaScript syntax with `node --check my-site/public/app-*.js` and run appropriate browser checks for changed interactions, keyboard access, reduced motion, and narrow layouts. Verify image assets and the animated Helix walkthrough when touching those areas. A static server smoke test does not validate the CRA build. If the legacy React scaffold test is run, assess whether it exercises the current static page rather than assuming it covers the timeline.

When changing fingerprinted JS or CSS, update the corresponding references in `public/index.html` so browsers receive the new files. Avoid editing unrelated assets or adding runtime dependencies unless needed.

## Deployment

`npm run build` produces `my-site/build/` for a static host. No repository CI/deployment workflow is currently configured; a Git push alone does not publish the site. Follow the user’s requested hosting process and verify the actual deployment. Do not assume temporary Sites previews are the GitHub deployment.
