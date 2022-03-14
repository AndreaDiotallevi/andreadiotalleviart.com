import React from "react"
import { graphql, PageProps } from "gatsby"
import { GatsbyImage, IGatsbyImageData } from "gatsby-plugin-image"

import Layout from "./layout"
import Seo from "../components/seo"
import PageTitle from "../components/pageTitle"

import * as blogStyles from "./blog.module.scss"

type DataProps = {
    markdownRemark: {
        frontmatter: {
            title: string
            description: string
            date: string
            featuredImage: {
                childImageSharp: {
                    gatsbyImageData: IGatsbyImageData
                    fixed: {
                        src: string
                    }
                }
            }
        }
        html: string
    }
}

const Blog = ({ data: { markdownRemark } }: PageProps<DataProps>) => {
    const { frontmatter, html } = markdownRemark
    const { title, description, featuredImage } = frontmatter

    return (
        <Layout>
            <React.Fragment>
                <Seo
                    title={title + " | Andrea Diotallevi"}
                    description={description}
                    image={featuredImage.childImageSharp.fixed.src}
                    article={true}
                    tags={[title]}
                />
                <article className={blogStyles.article}>
                    <PageTitle isHome={false} text={frontmatter.title} />
                    <p>{frontmatter.date}</p>
                    <GatsbyImage
                        image={featuredImage.childImageSharp.gatsbyImageData}
                        alt={title}
                    />
                    <div
                        dangerouslySetInnerHTML={{
                            __html: html,
                        }}
                    />
                </article>
            </React.Fragment>
        </Layout>
    )
}

export default Blog

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
                            quality: 99
                            layout: CONSTRAINED
                            placeholder: BLURRED
                        )
                        fixed {
                            src
                        }
                    }
                }
            }
            html
        }
    }
`
