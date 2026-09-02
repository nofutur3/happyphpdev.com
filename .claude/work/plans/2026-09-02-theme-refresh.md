# Theme Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use subagent-driven-development (recommended) or executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the stock `gatsby-starter-blog` visual theme with a professional, highly-readable design carrying a light Matrix/cyberpunk accent (green highlights, monospace headings/meta, a terminal-styled code theme), and fix the layout bugs found underneath it (broken responsive grid, `position: fixed` footer, duplicate/conflicting CSS between `global.scss` and `style.css`, unstyled prev/next nav, inconsistent post-list markup between the homepage and category/tag pages).

**Architecture:** Pure front-end change to an existing Gatsby v5 site. No new pages, no schema changes, no new routes. Design tokens live as CSS custom properties in `src/style.css` (already the pattern in this codebase); component/page files get targeted JSX/class edits to use those tokens and to fix the layout bugs; `src/styles/global.scss` is trimmed down to just its real job (importing Bootstrap).

**Tech Stack:** Gatsby 5 / React 19, Bootstrap 5 grid (`row`/`col-*`) for layout, Sass via `gatsby-plugin-sass`, Prism.js for code highlighting, `@fontsource/inter` + `@fontsource/jetbrains-mono` for self-hosted fonts (replacing `typeface-montserrat`/`typeface-merriweather`).

## Global Constraints

- No automated test suite exists for this project — `npm test` is a stub that always exits 1 (confirmed in `package.json` and documented in `CLAUDE.md`). Per the spec's Verification section, each task's gate is a scripted check against the running dev server (log check + curl for expected markup/status) instead of a unit-test cycle.
- No runtime (Node/npm) is installed on the host (host `node -v` is v10.16.3, far below Gatsby 5's floor). All `npm`/`gatsby` commands run inside the already-running Docker container via `docker compose exec app <cmd>` — the project directory is bind-mounted (`compose.yaml`: `./:/var/www`), so file changes and `package.json`/`package-lock.json` updates land on the host automatically.
- The dev server is already running in the `app` container (`docker compose ps` shows `happyphpdevcom-app-1` up, port 8000) and has hot-reload — CSS/JS edits should reflect at `http://localhost:8000` without restarting anything. **Do not run `npm run build` while this dev server is running** — `gatsby build` and `gatsby develop` sharing the same `.cache/` directory concurrently is a known source of cache corruption. Per-task verification instead checks the live dev server directly (recent container logs for compile errors + curl for expected markup); the one full `npm run build` in this plan runs alone, at the very end (Task 9), after the dev server's own hot-reload has already validated every change incrementally.
- No dark mode / theme toggle — light-first only.
- No "recent posts" sidebar widget — Categories list only.
- Commits: conventional commit format (`feat:`, `fix:`, `style:`, `refactor:`), one logical change per commit, per `.claude/workflow/rules/git.md`.

---

### Task 1: Swap font dependencies (Inter + JetBrains Mono)

**Files:**
- Modify: `package.json` (via `npm install`/`npm uninstall`, not manual edit)
- Modify: `gatsby-browser.js:1-3`

**Interfaces:**
- Produces: two CSS custom properties consumed by every later task — `--fontFamily-sans` (Inter stack) and `--fontFamily-mono` (JetBrains Mono stack), defined in Task 2.

- [ ] **Step 1: Remove the old typeface packages**

Run:
```bash
docker compose exec app npm uninstall typeface-montserrat typeface-merriweather
```

- [ ] **Step 2: Install the new font packages**

Run:
```bash
docker compose exec app npm install @fontsource/inter @fontsource/jetbrains-mono
```

- [ ] **Step 3: Verify `package.json` no longer lists the old packages and lists the new ones**

Run: `grep -E "typeface-|fontsource" package.json`
Expected: only `@fontsource/inter` and `@fontsource/jetbrains-mono` lines appear (no `typeface-*` lines).

- [ ] **Step 4: Swap the font imports in `gatsby-browser.js`**

Replace:
```js
// custom typefaces
import "typeface-montserrat"
import "typeface-merriweather"
```
with:
```js
// custom typefaces
import "@fontsource/inter/400.css"
import "@fontsource/inter/500.css"
import "@fontsource/inter/700.css"
import "@fontsource/jetbrains-mono/400.css"
import "@fontsource/jetbrains-mono/500.css"
import "@fontsource/jetbrains-mono/700.css"
```

- [ ] **Step 5: Restart the dev server to pick up the new dependencies, then verify it compiles**

New packages added to `node_modules` aren't picked up by an already-running webpack dev server, so restart it (this is a normal, safe restart of the one dev process — not a concurrent `build`):
```bash
docker compose restart app
docker compose logs --tail=50 app
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:8000/
```
Expected: logs show no `ERROR`/`failed` output; curl eventually prints `200` (retry it a few times a couple seconds apart if the server is still starting up).

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json gatsby-browser.js
git commit -m "chore: swap typeface packages for @fontsource/inter and @fontsource/jetbrains-mono"
```

---

### Task 2: Rewrite design tokens (colors, fonts, spacing rhythm) in `src/style.css`

**Files:**
- Modify: `src/style.css:1-64` (the `:root {}` token block)
- Modify: `src/style.css` body rule (`body { ... }`, currently lines ~78-82)

**Interfaces:**
- Consumes: `--fontFamily-sans`/`--fontFamily-mono` font stacks now backed by real font files (Task 1).
- Produces: tokens every later task relies on by name — `--color-bg`, `--color-surface`, `--color-surface-dark`, `--color-primary`, `--color-primary-bright`, `--color-text`, `--color-text-light`, `--color-heading`, `--color-heading-black`, `--color-accent`, `--color-border`, `--font-body`, `--font-heading`. Do not rename these in later tasks.

- [ ] **Step 1: Replace the `:root` token block**

Replace the entire existing block (from `:root {` through its closing `}`, i.e. everything currently between `--fontSize-7: 2.986rem;` and `--color-accent: #d1dce5;` plus the surrounding declarations) with:

```css
:root {
  --maxWidth-none: "none";
  --maxWidth-xs: 20rem;
  --maxWidth-sm: 24rem;
  --maxWidth-md: 28rem;
  --maxWidth-lg: 32rem;
  --maxWidth-xl: 36rem;
  --maxWidth-2xl: 42rem;
  --maxWidth-3xl: 48rem;
  --maxWidth-4xl: 56rem;
  --maxWidth-full: "100%";
  --maxWidth-wrapper: var(--maxWidth-2xl);
  --spacing-px: "1px";
  --spacing-0: 0;
  --spacing-1: 0.25rem;
  --spacing-2: 0.5rem;
  --spacing-3: 0.75rem;
  --spacing-4: 1rem;
  --spacing-5: 1.25rem;
  --spacing-6: 1.5rem;
  --spacing-8: 2rem;
  --spacing-10: 2.5rem;
  --spacing-12: 3rem;
  --spacing-16: 4rem;
  --spacing-20: 5rem;
  --spacing-24: 6rem;
  --spacing-32: 8rem;
  --fontFamily-sans: "Inter", system-ui, -apple-system, BlinkMacSystemFont,
    "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif,
    "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
  --fontFamily-mono: "JetBrains Mono", ui-monospace, SFMono-Regular, "SF Mono",
    Menlo, Consolas, "Liberation Mono", monospace;
  --font-body: var(--fontFamily-sans);
  --font-heading: var(--fontFamily-mono);
  --fontWeight-normal: 400;
  --fontWeight-medium: 500;
  --fontWeight-semibold: 600;
  --fontWeight-bold: 700;
  --fontWeight-extrabold: 800;
  --fontWeight-black: 900;
  --fontSize-root: 16px;
  --lineHeight-none: 1;
  --lineHeight-tight: 1.15;
  --lineHeight-normal: 1.5;
  --lineHeight-relaxed: 1.65;
  /* 1.200 Minor Third Type Scale */
  --fontSize-0: 0.833rem;
  --fontSize-1: 1rem;
  --fontSize-2: 1.2rem;
  --fontSize-3: 1.44rem;
  --fontSize-4: 1.728rem;
  --fontSize-5: 2.074rem;
  --fontSize-6: 2.488rem;
  --fontSize-7: 2.986rem;
  --color-bg: #fafafa;
  --color-surface: #ffffff;
  --color-surface-dark: #0d1210;
  --color-primary: #067a44;
  --color-primary-bright: #00ff9c;
  --color-text: #16201a;
  --color-text-light: #4b5a4f;
  --color-heading: #0f1811;
  --color-heading-black: #0a120c;
  --color-accent: #d7f2e3;
  --color-border: #e3e8e4;
}
```

Note: this removes `--fontFamily-serif` (no longer used — body font is now Inter, not Merriweather) and `--color-heading-black: black;` is now `#0a120c` (near-black, slightly warm) instead of pure black.

- [ ] **Step 2: Give the page an explicit background**

Replace:
```css
body {
  font-family: var(--font-body);
  font-size: var(--fontSize-1);
  color: var(--color-text);
}
```
with:
```css
body {
  font-family: var(--font-body);
  font-size: var(--fontSize-1);
  color: var(--color-text);
  background: var(--color-bg);
}
```

- [ ] **Step 3: Verify no other file references the removed `--fontFamily-serif` variable**

Run: `grep -rn "fontFamily-serif" src/ gatsby-browser.js`
Expected: no matches.

- [ ] **Step 4: Verify the dev server recompiled cleanly and the homepage still renders**

Run:
```bash
docker compose logs --tail=30 app
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:8000/
```
Expected: no `ERROR`/`failed` in the recent logs; curl prints `200`.

- [ ] **Step 5: Commit**

```bash
git add src/style.css
git commit -m "style: rework color and typography tokens for the theme refresh"
```

---

### Task 3: Fix the footer (sticky positioning bug) and remove conflicting CSS from `global.scss`

**Files:**
- Modify: `src/styles/global.scss` (remove the `footer { position: fixed; ... }` and `.bio { ... }` blocks entirely)
- Modify: `src/style.css` (`.global-wrapper` rule; `footer` rule)
- Modify: `src/components/footer.js`

**Interfaces:**
- Consumes: `--color-border`, `--color-text-light`, `--color-primary`, `--font-heading`, `--fontSize-0` (Task 2).
- Produces: `.site-footer` class used only here.

**Root cause note:** `src/styles/global.scss` is imported *last* in `gatsby-browser.js`, after `src/style.css`. It currently redefines `footer` with `position: fixed` (which overlaps page content on short pages) and `.bio` with `display: block` (which silently overrides `style.css`'s `.bio { display: flex }`, flattening the avatar+text layout). Removing these duplicate rules from `global.scss` — leaving it as pure Bootstrap import — fixes both bugs at the root instead of patching around them.

- [ ] **Step 1: Trim `global.scss` down to just its Bootstrap imports**

Replace the entire file content with:
```scss
@import "node_modules/bootstrap/scss/bootstrap";
@import "node_modules/bootstrap/scss/grid";
```

- [ ] **Step 2: Simplify `footer.js` and drop the Bootstrap utility classes it no longer needs**

Replace:
```jsx
import React from "react"
import BuildDate from "./build-date"

const Footer = () => (
  <footer className="footer mt-auto text-center">
    <p className="text-muted">
      This is static page generated by{" "}
      <a href="https://www.gatsbyjs.com">Gatsby.js</a>, built at <BuildDate />{" "}
      using <a href="https://github.com/">Github</a>'s pipelines and hosted by{" "}
      <a href="https://firebase.google.com/">Firebase</a>. Created by{" "}
      <a href="https://www.vyvazil.cz">Jakub Vyvazil</a>.
    </p>
  </footer>
)

export default Footer
```
with:
```jsx
import React from "react"
import BuildDate from "./build-date"

const Footer = () => (
  <footer className="site-footer">
    <p>
      This is static page generated by{" "}
      <a href="https://www.gatsbyjs.com">Gatsby.js</a>, built at <BuildDate />{" "}
      using <a href="https://github.com/">Github</a>'s pipelines and hosted by{" "}
      <a href="https://firebase.google.com/">Firebase</a>. Created by{" "}
      <a href="https://www.vyvazil.cz">Jakub Vyvazil</a>.
    </p>
  </footer>
)

export default Footer
```

- [ ] **Step 3: Make `.global-wrapper` a sticky-footer flex column and restyle the footer, in `src/style.css`**

Replace:
```css
.global-wrapper {
  margin: var(--spacing-0) auto;
  max-width: var(--maxWidth-wrapper);
  padding: var(--spacing-10) var(--spacing-5);
}
```
with:
```css
.global-wrapper {
  margin: var(--spacing-0) auto;
  max-width: var(--maxWidth-wrapper);
  padding: var(--spacing-10) var(--spacing-5);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.global-wrapper > .row {
  flex: 1 0 auto;
}
```

Then replace:
```css
footer {
  padding: var(--spacing-6) var(--spacing-0);
}
```
with:
```css
footer {
  padding: var(--spacing-6) var(--spacing-0);
}

.site-footer {
  border-top: 1px solid var(--color-border);
  margin-top: var(--spacing-16);
  text-align: center;
}

.site-footer p {
  font-family: var(--font-heading);
  font-size: var(--fontSize-0);
  color: var(--color-text-light);
  margin-bottom: 0;
}

.site-footer a {
  color: var(--color-text-light);
}

.site-footer a:hover {
  color: var(--color-primary);
}
```

- [ ] **Step 4: Verify the footer no longer overlaps content**

Run:
```bash
docker compose logs --tail=30 app
curl -s http://localhost:8000/ | grep -o 'class="site-footer"'
```
Expected: no `ERROR`/`failed` in the recent logs; grep finds one match (confirms the new footer markup/class made it into SSR'd HTML).

Then open `http://localhost:8000/` in a browser at a short viewport height and confirm the footer sits below the content instead of floating over it.

- [ ] **Step 5: Commit**

```bash
git add src/styles/global.scss src/style.css src/components/footer.js
git commit -m "fix: remove fixed-position footer and duplicate CSS overriding the sidebar"
```

---

### Task 4: Fix the responsive sidebar/content grid and add primary nav links

**Files:**
- Modify: `src/layouts/base.js`
- Modify: `src/style.css` (new `.sidebar-nav` rules)

**Interfaces:**
- Consumes: `--color-text-light`, `--color-primary`, `--font-heading`, `--fontSize-0` (Task 2).
- Produces: `.sidebar-nav` class, `#sidebar`/`#content` now using responsive `col-*` classes — Task 5 adds more content inside `#sidebar` but doesn't change these column classes.

- [ ] **Step 1: Fix the grid columns and add a nav block, in `src/layouts/base.js`**

Replace:
```jsx
  return (
    <div className="global-wrapper container" data-is-root-path={isRootPath}>
      <div className="row">
        <div className="col-2" id="sidebar">
          <header className="global-header">{header}</header>
          <Bio></Bio>
        </div>
        <main className="col-10" id="content">
          {children}
        </main>
      </div>
      <Footer></Footer>
    </div>
  )
```
with:
```jsx
  return (
    <div className="global-wrapper container" data-is-root-path={isRootPath}>
      <div className="row">
        <div className="col-12 col-md-3" id="sidebar">
          <header className="global-header">{header}</header>
          <nav className="sidebar-nav" aria-label="Primary">
            <ul>
              <li>
                <Link to="/">&gt; home</Link>
              </li>
              <li>
                <a href="/rss.xml">&gt; rss</a>
              </li>
            </ul>
          </nav>
          <Bio></Bio>
        </div>
        <main className="col-12 col-md-9" id="content">
          {children}
        </main>
      </div>
      <Footer></Footer>
    </div>
  )
```

(`Link` is already imported at the top of this file — no import change needed.)

- [ ] **Step 2: Add `.sidebar-nav` styling to `src/style.css`**

Add this new rule block in the "Custom classes" section (near `.global-header`):
```css
.sidebar-nav ul {
  list-style: none;
  padding: 0;
  margin: 0 0 var(--spacing-8) 0;
  font-family: var(--font-heading);
  font-size: var(--fontSize-0);
}

.sidebar-nav li {
  margin-bottom: var(--spacing-2);
}

.sidebar-nav a {
  color: var(--color-text-light);
  text-decoration: none;
}

.sidebar-nav a:hover {
  color: var(--color-primary);
}
```

- [ ] **Step 3: Verify the sidebar stacks on mobile and the nav renders**

Run:
```bash
docker compose logs --tail=30 app
curl -s http://localhost:8000/ | grep -o 'col-12 col-md-3\|col-12 col-md-9\|sidebar-nav'
```
Expected: no `ERROR`/`failed` in the recent logs; all three strings are found in the output.

Then open `http://localhost:8000/` in a browser, resize to a narrow (mobile) width, and confirm the sidebar stacks above the content instead of being crushed into a 2-column strip.

- [ ] **Step 4: Commit**

```bash
git add src/layouts/base.js src/style.css
git commit -m "fix: make sidebar/content grid responsive and add primary nav links"
```

---

### Task 5: Add a Categories list to the sidebar and polish the Bio block

**Files:**
- Modify: `src/components/bio.js`
- Modify: `src/style.css` (new `.sidebar-heading`/`.sidebar-categories` rules; tweak `.bio` rule)

**Interfaces:**
- Consumes: `fields.category` (a slug string, e.g. `"networking"`) already populated on `MarkdownRemark` nodes by `gatsby-plugin-categories`' `onCreateNode` hook whenever `frontmatter.category` is set; links to the existing `/category/<slug>/` pages that plugin already generates. `--color-text`, `--color-text-light`, `--color-primary`, `--font-heading`, `--fontSize-0` (Task 2).
- Produces: `.sidebar-categories` / `.sidebar-heading` classes used only here.

- [ ] **Step 1: Extend the Bio GraphQL query and render a Categories list**

Replace the full contents of `src/components/bio.js` with:
```jsx
/**
 * Bio component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.com/docs/use-static-query/
 */

import * as React from "react"
import { useStaticQuery, graphql, Link } from "gatsby"
import { StaticImage } from "gatsby-plugin-image"

const Bio = () => {
  const data = useStaticQuery(graphql`
    query BioQuery {
      site {
        siteMetadata {
          author {
            name
            summary
          }
          social {
            twitter
          }
        }
      }
      allMarkdownRemark(limit: 1000) {
        group(field: { fields: { category: SELECT } }) {
          fieldValue
          totalCount
        }
      }
    }
  `)

  // Set these values by editing "siteMetadata" in gatsby-config.js
  const author = data.site.siteMetadata?.author
  const social = data.site.siteMetadata?.social
  const categories = data.allMarkdownRemark.group.filter(
    ({ fieldValue }) => fieldValue,
  )

  return (
    <div className="bio">
      <div className="avatar">
        <StaticImage
          className="bio-avatar"
          layout="fixed"
          formats={["AUTO", "WEBP", "AVIF"]}
          src="../images/profile-pic.png"
          width={128}
          height={128}
          quality={95}
          alt="Profile picture"
        />
      </div>
      <div className="summary">
        {author?.name && (
          <p>
            Written by <strong>{author.name}</strong> {author?.summary || null}
          </p>
        )}
      </div>
      {categories.length > 0 && (
        <nav className="sidebar-categories" aria-label="Categories">
          <p className="sidebar-heading">// categories</p>
          <ul>
            {categories.map(({ fieldValue, totalCount }) => (
              <li key={fieldValue}>
                <Link to={`/category/${fieldValue}/`}>
                  {fieldValue} <span className="count">({totalCount})</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  )
}

export default Bio
```

(`social` is destructured but was already unused by the render in the original file — leaving it as-is preserves existing behavior/lint state; do not remove it as part of this task.)

- [ ] **Step 2: Add sidebar heading/categories styles and tighten `.bio` spacing, in `src/style.css`**

Replace:
```css
.bio {
  display: flex;
  margin-bottom: var(--spacing-16);
}
```
with:
```css
.bio {
  display: flex;
  margin-bottom: var(--spacing-8);
}
```

Then add this new rule block right after the `.bio-avatar` rule:
```css
.sidebar-heading {
  font-family: var(--font-heading);
  font-size: var(--fontSize-0);
  color: var(--color-text-light);
  text-transform: lowercase;
  letter-spacing: 0.05em;
  margin-bottom: var(--spacing-2);
}

.sidebar-categories ul {
  list-style: none;
  padding: 0;
  margin: 0;
  font-family: var(--font-heading);
  font-size: var(--fontSize-0);
}

.sidebar-categories li {
  margin-bottom: var(--spacing-2);
}

.sidebar-categories a {
  color: var(--color-text);
  text-decoration: none;
}

.sidebar-categories a:hover {
  color: var(--color-primary);
}

.sidebar-categories .count {
  color: var(--color-text-light);
}
```

- [ ] **Step 3: Verify the categories list renders with real data**

Run:
```bash
docker compose logs --tail=30 app
curl -s http://localhost:8000/ | grep -o 'sidebar-categories\|/category/[a-z0-9-]*/' | sort -u
```
Expected: no `ERROR`/`failed` in the recent logs (a GraphQL query error here would show up as a build/develop error in these logs — check carefully since this task adds a new query); `sidebar-categories` is present, and at least one `/category/<slug>/` link matching a real category from `content/blog/**` frontmatter (e.g. `/category/networking/`) is present.

- [ ] **Step 4: Commit**

```bash
git add src/components/bio.js src/style.css
git commit -m "feat: add a categories list to the sidebar"
```

---

### Task 6: Restyle the blog post header/meta line and prev/next nav; constrain prose width

**Files:**
- Modify: `src/templates/blog-post.js`
- Modify: `src/style.css` (`.blog-post header p` → `.post-meta`; `.blog-post-nav` rules; new `.blog-post section` max-width rule)

**Interfaces:**
- Consumes: `frontmatter.category` (human-readable string, e.g. `"networking"` — distinct from the slugified `fields.category` used for links in Task 5), `--color-text`, `--color-text-light`, `--color-primary`, `--font-heading`, `--fontSize-0` (Task 2).

- [ ] **Step 1: Add `category` to the post page's GraphQL query**

In `src/templates/blog-post.js`, replace:
```graphql
    markdownRemark(id: { eq: $id }) {
      id
      excerpt(pruneLength: 160)
      html
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        description
      }
    }
```
with:
```graphql
    markdownRemark(id: { eq: $id }) {
      id
      excerpt(pruneLength: 160)
      html
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
        description
        category
      }
    }
```

- [ ] **Step 2: Render a terminal-style meta line instead of a bare date paragraph**

Replace:
```jsx
        <header>
          <h1 itemProp="headline">{post.frontmatter.title}</h1>
          <p>{post.frontmatter.date}</p>
        </header>
```
with:
```jsx
        <header>
          <h1 itemProp="headline">{post.frontmatter.title}</h1>
          <p className="post-meta">
            {`// ${post.frontmatter.date}`}
            {post.frontmatter.category && ` · ${post.frontmatter.category}`}
          </p>
        </header>
```

- [ ] **Step 3: Move the inline prev/next nav styling into CSS classes**

Replace:
```jsx
      <nav className="blog-post-nav">
        <ul
          style={{
            display: `flex`,
            flexWrap: `wrap`,
            justifyContent: `space-between`,
            listStyle: `none`,
            padding: 0,
          }}
        >
          <li>
            {previous && (
              <Link to={previous.fields.slug} rel="prev">
                ← {previous.frontmatter.title}
              </Link>
            )}
          </li>
          <li>
            {next && (
              <Link to={next.fields.slug} rel="next">
                {next.frontmatter.title} →
              </Link>
            )}
          </li>
        </ul>
      </nav>
```
with:
```jsx
      <nav className="blog-post-nav">
        <ul>
          <li className="blog-post-nav-prev">
            {previous && (
              <Link to={previous.fields.slug} rel="prev">
                ← {previous.frontmatter.title}
              </Link>
            )}
          </li>
          <li className="blog-post-nav-next">
            {next && (
              <Link to={next.fields.slug} rel="next">
                {next.frontmatter.title} →
              </Link>
            )}
          </li>
        </ul>
      </nav>
```

- [ ] **Step 4: Replace the old meta-text rule with `.post-meta`, style the prev/next nav, and constrain prose width, in `src/style.css`**

Replace:
```css
.blog-post header p {
  font-size: var(--fontSize-2);
  font-family: var(--font-heading);
}
```
with:
```css
.post-meta {
  font-family: var(--font-heading);
  font-size: var(--fontSize-0);
  color: var(--color-text-light);
  letter-spacing: 0.02em;
}

.blog-post section {
  max-width: 70ch;
}
```

Then replace:
```css
.blog-post-nav ul {
  margin: var(--spacing-0);
}
```
with:
```css
.blog-post-nav ul {
  margin: var(--spacing-0);
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  list-style: none;
  padding: 0;
  font-family: var(--font-heading);
  font-size: var(--fontSize-0);
}

.blog-post-nav a {
  color: var(--color-text);
  text-decoration: none;
  border-bottom: 1px solid transparent;
}

.blog-post-nav a:hover {
  color: var(--color-primary);
  border-bottom-color: var(--color-primary);
}
```

- [ ] **Step 5: Verify a real post page renders the new meta line and nav styling**

Run:
```bash
docker compose logs --tail=30 app
SLUG=$(curl -s http://localhost:8000/ | grep -oE 'href="/[a-z0-9-]+/' | head -1 | sed 's/href="//')
curl -s "http://localhost:8000${SLUG}" | grep -o 'class="post-meta"\|blog-post-nav-prev\|blog-post-nav-next'
```
Expected: no `ERROR`/`failed` in the recent logs (this task adds `category` to the query — check carefully for a GraphQL field error); `class="post-meta"` is found (prev/next classes will only appear if that post has a neighbor — check on a couple of posts if the first one is first/last in the sequence).

- [ ] **Step 6: Commit**

```bash
git add src/templates/blog-post.js src/style.css
git commit -m "style: restyle post meta line and prev/next nav, constrain prose width"
```

---

### Task 7: Custom Matrix-style dark theme for code blocks

**Files:**
- Create: `src/styles/prism-theme.css`
- Modify: `gatsby-browser.js` (swap the Prism theme import)

**Interfaces:**
- Consumes: `--color-surface-dark`, `--color-primary-bright`, `--font-heading`, `--spacing-4` (Task 2).
- Produces: nothing consumed by later tasks — this is a self-contained visual swap.

- [ ] **Step 1: Write the custom Prism theme**

Create `src/styles/prism-theme.css`:
```css
/* Matrix-inspired dark code theme (replaces prismjs/themes/prism.css) */

code[class*="language-"],
pre[class*="language-"] {
  color: #d7ffe9;
  background: none;
  font-family: var(--font-heading);
  font-size: 0.9em;
  line-height: 1.5;
  text-shadow: none;
}

pre[class*="language-"] {
  background: var(--color-surface-dark);
  padding: var(--spacing-4);
  margin: 0.5em 0;
  overflow: auto;
  border-radius: 4px;
  border: 1px solid #1c2a20;
}

:not(pre) > code[class*="language-"] {
  background: var(--color-surface-dark);
  color: var(--color-primary-bright);
  padding: 0.15em 0.4em;
  border-radius: 3px;
}

.token.comment,
.token.prolog,
.token.doctype,
.token.cdata {
  color: #5c8a6d;
  font-style: italic;
}

.token.punctuation {
  color: #8fae9a;
}

.token.property,
.token.tag,
.token.boolean,
.token.number,
.token.constant,
.token.symbol,
.token.deleted {
  color: #6ee7a7;
}

.token.selector,
.token.attr-name,
.token.string,
.token.char,
.token.builtin,
.token.inserted {
  color: #00ff9c;
}

.token.operator,
.token.entity,
.token.url,
.language-css .token.string,
.style .token.string {
  color: #8fae9a;
}

.token.atrule,
.token.attr-value,
.token.keyword {
  color: #39d97a;
  font-weight: var(--fontWeight-medium);
}

.token.function,
.token.class-name {
  color: #7be6c1;
}

.token.regex,
.token.important,
.token.variable {
  color: #d7ffe9;
}
```

- [ ] **Step 2: Swap the theme import in `gatsby-browser.js`**

Replace:
```js
// Highlighting for code blocks
import "prismjs/themes/prism.css"
```
with:
```js
// Highlighting for code blocks
import "./src/styles/prism-theme.css"
```

- [ ] **Step 3: Verify a post containing a code block renders with the dark theme**

Run:
```bash
docker compose logs --tail=30 app
grep -rl '```' content/blog --include="*.md" | head -1
```
Take the matching post's slug (derived from its path, e.g. `content/blog/2021/06/adminer/index.md` → `/2021/06/adminer/`), then:
```bash
curl -s http://localhost:8000/<slug>/ | grep -o 'language-'
```
Expected: no `ERROR`/`failed` in the recent logs; at least one `language-` match (confirms Prism classes are present in the rendered HTML). Then open that post in a browser and visually confirm the code block has a dark background with green-tinted syntax highlighting.

- [ ] **Step 4: Commit**

```bash
git add src/styles/prism-theme.css gatsby-browser.js
git commit -m "style: add a Matrix-inspired dark theme for code blocks"
```

---

### Task 8: Unify the homepage post list with `PostsList`/`PostsListCard` and drop the Bootstrap Card styling

**Files:**
- Modify: `src/pages/index.js`
- Modify: `src/components/post-list-card.js`
- Modify: `src/style.css` (remove unused `.post-list-item*` rules, add `.post-card` rules)

**Interfaces:**
- Consumes: `PostsList` component (`src/components/post-list.js`, unchanged — takes a `postEdges` prop shaped like GraphQL `edges { node { ... } }` and maps it to `<PostsListCard key={node.fields.slug} {...node} />`), `--color-text`, `--color-text-light`, `--color-primary`, `--color-border`, `--font-heading`, `--fontSize-0`, `--fontSize-4` (Task 2).
- Produces: `.post-card` class, now used identically by the homepage, category pages, and tag pages (category/tag templates already render `PostsList`, so they pick up this styling automatically — no changes needed to `src/templates/category.js` or `src/templates/tag.js`).

- [ ] **Step 1: Rewrite `PostsListCard` without the react-bootstrap `Card` wrapper**

Replace the full contents of `src/components/post-list-card.js` with:
```jsx
import React from "react"
import { Link } from "gatsby"

const PostsListCard = ({ frontmatter, fields, excerpt }) => {
  const title = frontmatter.title || fields.slug

  return (
    <article className="post-card">
      <p className="post-card-meta">
        {frontmatter.date}
        {fields.category && ` · ${fields.category}`}
      </p>
      <h2 className="post-card-title">
        <Link to={`/${fields.slug}/`}>{title}</Link>
      </h2>
      <div
        className="post-card-excerpt"
        dangerouslySetInnerHTML={{
          __html: frontmatter.description || excerpt,
        }}
      />
      <Link to={`/${fields.slug}/`} className="post-card-link">
        Read more &rarr;
      </Link>
    </article>
  )
}

export default PostsListCard
```

- [ ] **Step 2: Rewrite `src/pages/index.js` to use `PostsList` and query `edges` instead of hand-rolled markup**

Replace the full contents of `src/pages/index.js` with:
```jsx
import * as React from "react"
import { graphql } from "gatsby"

import Layout from "../layouts/base"
import Seo from "../components/seo"
import PostsList from "../components/post-list"

const BlogIndex = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata?.title || `Title`
  const posts = data.allMarkdownRemark.edges

  if (posts.length === 0) {
    return (
      <Layout location={location} title={siteTitle}>
        <Seo title="Homepage" />
        <p>
          No blog posts found. Add markdown posts to "content/blog" (or the
          directory you specified for the "gatsby-source-filesystem" plugin in
          gatsby-config.js).
        </p>
      </Layout>
    )
  }

  return (
    <Layout location={location} title={siteTitle}>
      <Seo title="A lot of bits" />
      <PostsList postEdges={posts} />
    </Layout>
  )
}

export default BlogIndex

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(sort: { frontmatter: { date: DESC } }) {
      edges {
        node {
          excerpt
          fields {
            slug
            category
          }
          frontmatter {
            date(formatString: "MMMM DD, YYYY")
            title
            description
          }
        }
      }
    }
  }
`
```

- [ ] **Step 3: Remove the now-unused `.post-list-item*` rules and add `.post-card` styling, in `src/style.css`**

Delete these four rule blocks (no longer referenced by any component after Step 2):
```css
.post-list-item {
  margin-bottom: var(--spacing-8);
  margin-top: var(--spacing-8);
}

.post-list-item p {
  margin-bottom: var(--spacing-0);
}

.post-list-item h2 {
  font-size: var(--fontSize-4);
  color: var(--color-primary);
  margin-bottom: var(--spacing-2);
  margin-top: var(--spacing-0);
}

.post-list-item header {
  margin-bottom: var(--spacing-4);
}
```

Add this new block in their place:
```css
.post-card {
  border-bottom: 1px solid var(--color-border);
  padding-bottom: var(--spacing-8);
  margin-bottom: var(--spacing-8);
}

.post-card-meta {
  font-family: var(--font-heading);
  font-size: var(--fontSize-0);
  color: var(--color-text-light);
  margin-bottom: var(--spacing-2);
}

.post-card-title {
  font-size: var(--fontSize-4);
  margin-top: 0;
  margin-bottom: var(--spacing-2);
}

.post-card-title a {
  color: var(--color-heading);
  text-decoration: none;
}

.post-card-title a:hover {
  color: var(--color-primary);
}

.post-card-excerpt {
  margin-bottom: var(--spacing-4);
}

.post-card-link {
  font-family: var(--font-heading);
  font-size: var(--fontSize-0);
  text-decoration: none;
  color: var(--color-primary);
}

.post-card-link:hover {
  text-decoration: underline;
}
```

- [ ] **Step 4: Verify homepage, category, and tag pages all render posts identically**

Run:
```bash
docker compose logs --tail=30 app
curl -s http://localhost:8000/ | grep -oc 'class="post-card"'
```
Expected: no `ERROR`/`failed` in the recent logs (this task rewrites the homepage GraphQL query — check carefully); count is greater than 0 and matches the number of posts under `content/blog/`.

Then find a real category and confirm it uses the same markup:
```bash
CATEGORY_PATH=$(curl -s http://localhost:8000/ | grep -oE '/category/[a-z0-9-]+/' | head -1)
curl -s "http://localhost:8000${CATEGORY_PATH}" | grep -oc 'class="post-card"'
```
Expected: count is greater than 0.

- [ ] **Step 5: Commit**

```bash
git add src/pages/index.js src/components/post-list-card.js src/style.css
git commit -m "refactor: unify homepage post list with PostsList/PostsListCard, drop Bootstrap Card styling"
```

---

### Task 9: Final visual QA and cleanup pass

**Files:** none created/modified beyond formatting fixes to files already touched by Tasks 1–8.

- [ ] **Step 1: Run Prettier over every file changed in this plan**

Run:
```bash
docker compose exec app npx prettier --write \
  src/style.css src/styles/global.scss src/styles/prism-theme.css \
  src/layouts/base.js src/components/bio.js src/components/footer.js \
  src/templates/blog-post.js src/pages/index.js src/components/post-list-card.js \
  gatsby-browser.js
```
Expected: exits 0 (Prettier reformats in place if needed).

- [ ] **Step 2: Full production build**

Stop the dev server first — running `build` and `develop` against the same `.cache/` directory at once is unsupported:
```bash
docker compose stop app
docker compose run --rm app npm run build
docker compose up -d app
```
Expected: build completes with no errors; `docker compose ps` shows `app` back up afterward.

- [ ] **Step 3: Visual walkthrough in a real browser**

Using the browser automation tools, visit and screenshot, at both a desktop width (~1280px) and a mobile width (~375px):
- `http://localhost:8000/` (homepage — post cards, sidebar with nav + bio + categories, footer)
- one individual post page (article typography, code block if the post has one, prev/next nav)
- one `/category/<slug>/` page

Confirm: no visual overlap between footer and content; sidebar stacks correctly on mobile; code blocks show the dark green-on-black theme; links/headings show the green accent and monospace treatment; body text is the Inter sans font and reads comfortably at the constrained width.

- [ ] **Step 4: Commit formatting fixes, if any**

```bash
git status --porcelain
```
If this shows any modified files (Prettier made changes), then:
```bash
git add -u
git commit -m "style: run prettier over theme refresh changes"
```
If it shows nothing, skip the commit — there's nothing to commit.
