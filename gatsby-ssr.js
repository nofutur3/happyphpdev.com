const React = require("react")

exports.onRenderBody = ({ setHeadComponents }) => {
  setHeadComponents([
    <script
      key="umami"
      defer
      src="https://umami.nofutur3.com/script.js"
      data-website-id="c458a085-e846-4733-b4c6-525dd54e16ff"
    />,
  ])
}

// Gatsby inlines the full stylesheet into every page's <head>. Link the
// cacheable styles.<hash>.css instead so each page doesn't re-ship it.
exports.onPreRenderHTML = ({ getHeadComponents, replaceHeadComponents }) => {
  if (process.env.NODE_ENV !== "production") return

  replaceHeadComponents(
    getHeadComponents().map(el =>
      el.type === "style" && el.props["data-href"] ? (
        <link
          rel="stylesheet"
          key={el.props["data-href"]}
          href={el.props["data-href"]}
        />
      ) : (
        el
      ),
    ),
  )
}
