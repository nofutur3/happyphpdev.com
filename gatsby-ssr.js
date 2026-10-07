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
