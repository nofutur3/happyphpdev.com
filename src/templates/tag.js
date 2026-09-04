import React from "react"
import { graphql } from "gatsby"

import Layout from "../layouts/base"
import Seo from "../components/seo"
import PostTitleList from "../components/post-title-list"

const TagTemplate = ({ location, pageContext, data }) => {
  const { tag } = pageContext
  return (
    <Layout location={location} title={`Posts in tag "${tag}"`}>
      <Seo title={`Posts in tag "${tag}"`} />
      <header className="archive-header">
        <p className="archive-eyebrow">// tag</p>
        <h1 className="archive-title">{tag}</h1>
      </header>
      <PostTitleList postEdges={data.allMarkdownRemark.edges} />
    </Layout>
  )
}

export const pageQuery = graphql`
  query TagPage($tag: String) {
    allMarkdownRemark(
      limit: 1000
      filter: { fields: { tags: { in: [$tag] } } }
    ) {
      totalCount
      edges {
        node {
          fields {
            slug
          }
          frontmatter {
            title
          }
        }
      }
    }
  }
`

export default TagTemplate
