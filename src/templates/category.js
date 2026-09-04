import React from "react"
import { graphql } from "gatsby"

import Layout from "../layouts/base"
import Seo from "../components/seo"
import PostTitleList from "../components/post-title-list"

const CategoryTemplate = ({ location, pageContext, data }) => {
  const { category } = pageContext
  return (
    <Layout location={location} title={`Posts in category "${category}"`}>
      <Seo title={`Posts in category "${category}"`} />
      <header className="archive-header">
        <p className="archive-eyebrow">// category</p>
        <h1 className="archive-title">{category}</h1>
      </header>
      <PostTitleList postEdges={data.allMarkdownRemark.edges} />
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
          }
          frontmatter {
            title
          }
        }
      }
    }
  }
`

export default CategoryTemplate
