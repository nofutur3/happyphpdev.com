import React from "react"
import { graphql } from "gatsby"
import { Container } from "react-bootstrap"

import Layout from "../layouts/base"
import Seo from "../components/seo"
import PostsList from "../components/post-list"

const CategoryTemplate = ({ location, pageContext, data }) => {
  const { category } = pageContext
  return (
    <Layout location={location} title={`Posts in category "${category}"`}>
      <div className="category-container">
        <Seo title={`Posts in category "${category}"`} />

        <Container>
          <h1>Category: {category}</h1>
          <PostsList postEdges={data.allMarkdownRemark.edges} />
        </Container>
      </div>
    </Layout>
  )
}

export const pageQuery = graphql`
  query CategoryPage($category: String) {
    allMarkdownRemark(
      limit: 1000
      filter: { fields: { category: { eq: $category } } }
    ) {
      totalCount
      edges {
        node {
          fields {
            slug
            category
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

export default CategoryTemplate
