import React from "react"
import { Link } from "gatsby"

const EXCERPT_SEPARATOR = "<!-- more -->"

const PostsListCard = ({
  frontmatter,
  fields,
  excerpt,
  html,
  rawMarkdownBody,
}) => {
  const title = frontmatter.title || fields.slug
  const hasMore = Boolean(
    rawMarkdownBody && rawMarkdownBody.includes(EXCERPT_SEPARATOR),
  )
  const body = hasMore ? excerpt : html

  return (
    <article className="post-card">
      <p className="post-card-meta">
        {frontmatter.date}
        {fields.category && ` · ${fields.category}`}
      </p>
      <h2 className="post-card-title">
        <Link to={fields.slug}>{title}</Link>
      </h2>
      <div
        className="post-card-excerpt"
        dangerouslySetInnerHTML={{ __html: body }}
      />
      {hasMore && (
        <Link to={fields.slug} className="post-card-link">
          Read more &rarr;
        </Link>
      )}
    </article>
  )
}

export default PostsListCard
