import * as React from "react"
import { Link } from "gatsby"
import Footer from "./../components/footer"
import Bio from "../components/bio";

const Base = ({ location, title, children }) => {
  const rootPath = `${__PATH_PREFIX__}/`
  const isRootPath = location.pathname === rootPath
  let header

  if (isRootPath) {
    header = (
      <h1 className="main-heading">
        <Link to="/">{title}</Link>
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
}

export default Base
