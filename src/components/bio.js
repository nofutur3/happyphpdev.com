/**
 * Bio component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.com/docs/use-static-query/
 */

import * as React from "react"
import { useStaticQuery, graphql } from "gatsby"
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
    }
  `)

  // Set these values by editing "siteMetadata" in gatsby-config.js
  const author = data.site.siteMetadata?.author
  const social = data.site.siteMetadata?.social

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
    </div>
  )
}

export default Bio
