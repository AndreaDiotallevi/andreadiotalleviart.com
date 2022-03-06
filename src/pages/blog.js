import React from "react"
import { Link, graphql, useStaticQuery } from "gatsby"
import { GatsbyImage } from "gatsby-plugin-image"

import Layout from "../templates/layout"
import Seo from "../components/seo"
import PageTitle from "../components/pageTitle"

import * as blogStyles from "./blog.module.scss"

const BlogPage = () => {
    const data = useStaticQuery(graphql`
        {
            allMarkdownRemark(
                sort: { order: DESC, fields: [frontmatter___date] }
            ) {
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
    `)

    return (
        <Layout>
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
                        {data.allMarkdownRemark.edges.map(edge => (
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
                                        />
                                    </div>
                                    <p>{edge.node.frontmatter.date}</p>
                                    <h2>{edge.node.frontmatter.title}</h2>
                                    <p>{edge.node.frontmatter.description}</p>
                                </Link>
                            </li>
                        ))}
                    </ol>
                </div>
            </div>
        </Layout>
    )
}

export default BlogPage
