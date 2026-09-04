/**
 * Categories component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.com/docs/use-static-query/
 */

import * as React from "react"
import { useStaticQuery, graphql, Link } from "gatsby"

const Categories = () => {
  const data = useStaticQuery(graphql`
    query CategoriesQuery {
      allMarkdownRemark(limit: 1000) {
        group(field: { fields: { category: SELECT } }) {
          fieldValue
          totalCount
        }
      }
    }
  `)

  const categories = data.allMarkdownRemark.group.filter(
    ({ fieldValue }) => fieldValue,
  )

  if (categories.length === 0) {
    return null
  }

  return (
    <li className="sidebar-categories">
      <span className="menu-marker">//</span>categories
      <ul>
        {categories.map(({ fieldValue, totalCount }) => (
          <li key={fieldValue}>
            <Link to={`/category/${fieldValue}/`}>
              <span className="menu-marker">&gt;</span>
              {fieldValue} <span className="count">({totalCount})</span>
            </Link>
          </li>
        ))}
      </ul>
    </li>
  )
}

export default Categories
