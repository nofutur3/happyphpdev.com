import React from "react"
import { graphql } from "gatsby"
import { Container } from "react-bootstrap"

import Layout from "../layouts/base"
import Seo from "../components/seo"
import PostsList from "../components/post-list"

const TagTemplate = ({ location, pageContext, data }) => {
  const { tag } = pageContext
  return (
    <Layout location={location} title={`Posts in tag "${tag}"`}>
      <div className="tag-container">
        <Seo title={`Posts in tag "${tag}"`} />
        <Container>
          <h1>Tag: {tag}</h1>
          <PostsList postEdges={data.allMarkdownRemark.edges} />
        </Container>
      </div>
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
            tags
          }
          excerpt
          timeToRead
          frontmatter {
            title
            date
          }
        }
      }
    }
  }
`

export default TagTemplate
