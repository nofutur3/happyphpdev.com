import React from "react"
import PostsListCard from "./post-list-card"

const PostsList = ({ postEdges }) => {
  return postEdges.map(({ node }, index) => (
    <React.Fragment key={node.fields.slug}>
      {index > 0 && (
        <div className="post-divider" aria-hidden="true">
          <span className="post-divider-line"></span>
          <span className="post-divider-stat">
            <span className="post-divider-plus">+1</span> post
          </span>
          <span className="post-divider-line"></span>
        </div>
      )}
      <PostsListCard {...node} />
    </React.Fragment>
  ))
}

export default PostsList
