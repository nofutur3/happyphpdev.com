import React from "react"
import PostsListCard from "./post-list-card"

const PostsList = ({ postEdges }) => {
  return postEdges.map(({ node }) => {
    return <PostsListCard key={node.fields.slug} {...node} />
  })
}

export default PostsList
