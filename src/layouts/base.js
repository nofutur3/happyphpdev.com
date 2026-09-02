import * as React from "react"
import { Link } from "gatsby"
import Footer from "./../components/footer"
import Bio from "../components/bio"

const Base = ({ location, title, children }) => {
  const rootPath = `${__PATH_PREFIX__}/`
  const isRootPath = location.pathname === rootPath
  let header

  if (isRootPath) {
    header = (
      <h1 className="main-heading">
        <Link to="/" className="brand" aria-label={title}>
          <span className="brand-prompt">$</span> happyphpdev<span className="brand-cursor" aria-hidden="true">&#9608;</span>
        </Link>
      </h1>
    )
  } else {
    header = (
      <Link className="header-link-home" to="/">
        &#8592; home
      </Link>
    )
  }

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
}

export default Base
