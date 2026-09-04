import React from "react"
import { Link } from "gatsby"

const PostTitleList = ({ postEdges }) => (
  <ul className="post-title-list">
    {postEdges.map(({ node }) => (
      <li key={node.fields.slug}>
        <Link to={node.fields.slug}>
          {node.frontmatter.title || node.fields.slug}
        </Link>
      </li>
    ))}
  </ul>
)

export default PostTitleList
