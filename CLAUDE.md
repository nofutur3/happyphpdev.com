# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

happyphpdev.com is a Gatsby v3 (React 17) blog, based on the official `gatsby-starter-blog`, deployed statically to Firebase Hosting.

## Commands

- `npm ci` — install dependencies from `package-lock.json` (note: it's `npm ci`, the built-in npm command, not `npm run ci` — no `ci` script exists in `package.json` despite readme.md/AGENTS.md saying otherwise)
- `npm run develop` (alias: `npm start`) — start the dev server at http://localhost:8000
- `npm run docker-develop` — dev server bound to `0.0.0.0` (used inside Docker)
- `npm run build` — production build into `public/`
- `npm run serve` — serve the built `public/` locally
- `npm run clean` — clear Gatsby's `.cache/` and `public/` (fixes most stale-data/GraphQL-schema build issues)
- `npm run format` — Prettier write across `**/*.{js,jsx,ts,tsx,json,md}` (see `.prettierrc`/`.prettierignore`)
- `npm run deploy` — `gatsby build --prefix-links && firebase deploy`
- `npm test` — currently a stub that always exits 1 (no test suite exists yet)

Docker: `docker compose up -d` builds from `docker/node/Dockerfile` and runs `npm run docker-develop`, publishing on `${PORT:-8000}` with UID/GID/PORT from `.env` (see `.env.example`).

There is a `.github/workflows/deploy-to-firebase.yml` CI job that also runs `npm run lint` and `npm run typecheck` and pushes to Firebase on `main` — those two scripts don't exist in `package.json` yet, so the workflow (currently modified/uncommitted) will fail until they're added.

## Architecture

- **Content-driven routing**: `gatsby-node.js` queries all `MarkdownRemark` nodes under `content/blog/**` (sourced via `gatsby-source-filesystem`, configured in `gatsby-config.js`) and calls `createPage` for each post using the `src/templates/blog-post.js` template, passing `previousPostId`/`nextPostId` context for prev/next navigation. `onCreateNode` derives each post's URL slug from its file path via `createFilePath`. Categories and tags get their own generated pages via `gatsby-plugin-categories` / `gatsby-plugin-tags`, using `src/templates/category.js` and `src/templates/tag.js` respectively — driven by the `category`/`tags` frontmatter fields.
- **Posts** live at `content/blog/<year>/<month>/<slug>/index.md`, each with frontmatter (`title`, `date`, `description`, `category`, `tags`) plus co-located images referenced by relative path (processed by `gatsby-remark-images` / `gatsby-plugin-sharp`).
- **Schema customization**: `gatsby-node.js`'s `createSchemaCustomization` explicitly types `SiteSiteMetadata`, `MarkdownRemark.frontmatter`, and `.fields` so GraphQL queries don't error out when `content/blog` is empty or frontmatter fields are missing.
- **Layout composition**: every page/template wraps content in `src/layouts/base.js`, which renders a sidebar (`Bio`) + main content column (Bootstrap-based `.container`/`.row`/`.col-*` grid) and a shared `Footer`. `src/components/seo.js` handles per-page `<head>` metadata via `react-helmet`.
- **Styling**: Bootstrap 5 + custom Sass (`src/styles/global.scss`, `src/styles/variables.scss`) via `gatsby-plugin-sass`, plus `src/normalize.css`/`src/style.css`.
- **Mixed JS/TS**: most of the codebase is plain `.js`, but a couple of files (`src/pages/using-typescript.tsx`, `src/components/support.tsx`) are `.tsx`. There is no `tsconfig.json` or TypeScript type-checking configured yet — Gatsby transpiles TS/TSX out of the box but nothing enforces types.
- **Feed/manifest**: `gatsby-plugin-feed` generates `/rss.xml` from all `MarkdownRemark` nodes; `gatsby-plugin-manifest` configures the PWA manifest (site name, icon, theme colors).
- **Deployment target**: `firebase.json`/`.firebaserc` point at Firebase project `happyphpdev-com`, serving the `public/` build output.

@.claude/workflow/CLAUDE.md
