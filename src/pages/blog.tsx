import React from "react"
import { Link, graphql, PageProps } from "gatsby"
import { GatsbyImage, IGatsbyImageData } from "gatsby-plugin-image"

import Layout from "../templates/layout"
import Seo from "../components/seo"
import PageTitle from "../components/pageTitle"

import * as blogStyles from "./blog.module.scss"

type DataProps = {
    allMarkdownRemark: {
        edges: [
            {
                node: {
                    frontmatter: {
                        title: string
                        description: string
                        date: string
                        tags: string[]
                        featuredImage: {
                            childImageSharp: {
                                gatsbyImageData: IGatsbyImageData
                            }
                        }
                    }
                    fields: {
                        slug: string
                    }
                }
            }
        ]
    }
}

const BlogPage = ({ data: { allMarkdownRemark } }: PageProps<DataProps>) => {
    return (
        <Layout>
            <React.Fragment>
                <Seo
                    title="Blog | Andrea Diotallevi"
                    description="Andrea Diotallevi's blog posts"
                />
                <div style={{ marginBottom: 50 }}>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            width: "100%",
                            marginBottom: "50px",
                        }}
                    >
                        <PageTitle isHome={false} text="Blog" />
                        <ol className={blogStyles.container}>
                            {allMarkdownRemark.edges.map(edge => (
                                <li key={edge.node.frontmatter.title}>
                                    <Link
                                        to={`/blog/${edge.node.fields.slug}`}
                                        key={edge.node.frontmatter.title}
                                    >
                                        <div>
                                            <GatsbyImage
                                                image={
                                                    edge.node.frontmatter
                                                        .featuredImage
                                                        .childImageSharp
                                                        .gatsbyImageData
                                                }
                                                alt={
                                                    edge.node.frontmatter.title
                                                }
                                            />
                                        </div>
                                        <p>{edge.node.frontmatter.date}</p>
                                        <h2>{edge.node.frontmatter.title}</h2>
                                        <p>
                                            {edge.node.frontmatter.description}
                                        </p>
                                    </Link>
                                </li>
                            ))}
                        </ol>
                    </div>
                </div>
            </React.Fragment>
        </Layout>
    )
}

export default BlogPage

export const query = graphql`
    {
        allMarkdownRemark(sort: { order: DESC, fields: [frontmatter___date] }) {
            edges {
                node {
                    frontmatter {
                        title
                        description
                        date(formatString: "MMM Do, YYYY")
                        tags
                        featuredImage {
                            childImageSharp {
                                gatsbyImageData(
                                    width: 310
                                    quality: 100
                                    layout: CONSTRAINED
                                    placeholder: BLURRED
                                )
                            }
                        }
                    }
                    fields {
                        slug
                    }
                }
            }
        }
    }
`
