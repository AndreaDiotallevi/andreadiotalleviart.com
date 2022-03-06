import React from "react"
import { graphql } from "gatsby"
import { GatsbyImage } from "gatsby-plugin-image"

import Layout from "../templates/layout"
import Seo from "../components/seo"
import PageTitle from "../components/pageTitle"

import * as blogStyles from "./blog.module.scss"

export const query = graphql`
    query($slug: String!) {
        markdownRemark(fields: { slug: { eq: $slug } }) {
            frontmatter {
                title
                description
                date(formatString: "MMMM Do, YYYY")
                featuredImage {
                    childImageSharp {
                        gatsbyImageData(
                            width: 660
                            layout: CONSTRAINED
                            placeholder: BLURRED
                        )
                    }
                }
            }
            html
        }
    }
`

const Blog = props => {
    const {
        title,
        description,
        // date,
        featuredImage,
    } = props.data.markdownRemark.frontmatter

    const { frontmatter, html } = props.data.markdownRemark

    return (
        <Layout>
            <Seo
                title={title + " | Andrea Diotallevi"}
                description={description}
                image={featuredImage.childImageSharp.gatsbyImageData.src}
                article={true}
            />
            <article className={blogStyles.article}>
                <PageTitle isHome={false} text={frontmatter.title} />
                <p>{frontmatter.date}</p>
                <GatsbyImage
                    image={featuredImage.childImageSharp.gatsbyImageData}
                />
                <div
                    dangerouslySetInnerHTML={{
                        __html: html,
                    }}
                />
            </article>
        </Layout>
    )
}

export default Blog
