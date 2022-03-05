import React from "react"
import { graphql } from "gatsby"
import Img from "gatsby-image"

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
                        fluid(maxWidth: 668) {
                            ...GatsbyImageSharpFluid
                        }
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
                image={featuredImage.childImageSharp.fluid.src}
                article={true}
            />
            <article className={blogStyles.article}>
                <PageTitle isHome={false} text={frontmatter.title} />
                <p>{frontmatter.date}</p>
                <Img fluid={featuredImage.childImageSharp.fluid} />
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
