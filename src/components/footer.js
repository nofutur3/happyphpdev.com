import React from "react"
import BuildDate from "./build-date"

const Footer = () => (
  <footer className="footer mt-auto text-center">
    <p className="text-muted">
      This is static page generated by{" "}
      <a href="https://www.gatsbyjs.com">Gatsby.js</a>, built at{" "}
      <BuildDate></BuildDate> using{" "}
      <a href="https://bitbucket.org/">Bitbucket</a>'s pipelines and hosted by{" "}
      <a href="https://firebase.google.com/">Firebase</a>. Created by{" "}
      <a href="https://www.vyvazil.cz">Jakub Vyvazil</a>.
    </p>
  </footer>
)

export default Footer