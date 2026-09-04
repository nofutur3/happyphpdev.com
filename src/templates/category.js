import React from "react"
import { graphql } from "gatsby"

import Layout from "../layouts/base"
import Seo from "../components/seo"
import PostsList from "../components/post-list"

const CategoryTemplate = ({ location, pageContext, data }) => {
  const { category } = pageContext
  return (
    <Layout location={location} title={`Posts in category "${category}"`}>
      <Seo title={`Posts in category "${category}"`} />
      <header className="archive-header">
        <p className="archive-eyebrow">// category</p>
        <h1 className="archive-title">{category}</h1>
      </header>
      <PostsList
        postEdges={data.allMarkdownRemark.edges}
        showCategory={false}
      />
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
