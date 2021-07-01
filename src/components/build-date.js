import React from "react"
import { graphql, useStaticQuery } from "gatsby"

const BuildDate = () => {
    const data = useStaticQuery(graphql`
    query {
      currentBuildDate {
        currentDate
      }
    }
  `)

    return (
        <span>{data.currentBuildDate.currentDate}</span>
    )
}

export default BuildDate
