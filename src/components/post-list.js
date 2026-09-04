import React from "react"
import PostsListCard from "./post-list-card"

const PostsList = ({ postEdges, showCategory = true }) => {
  return postEdges.map(({ node }) => {
    return (
      <PostsListCard
        key={node.fields.slug}
        {...node}
        showCategory={showCategory}
      />
    )
  })
}

export default PostsList
