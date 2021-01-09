import React from "react"
import { Link } from "gatsby"
import { graphql } from "gatsby"
import Img from "gatsby-image"

import Layout from "../templates/layout"
import Seo from "../components/seo"

import portfolioStyles from "./portfolio.module.scss"

export const query = graphql`
    query {
        allArtworksJson {
            edges {
                node {
                    slug
                    name
                    images {
                        childImageSharp {
                            fluid(maxWidth: 310) {
                                ...GatsbyImageSharpFluid
                            }
                        }
                    }
                }
            }
        }
    }
`

const Portfolio = (props) => {
    return (
        <Layout>
            <Seo
                title="Portfolio | Andrea Diotallevi"
                description="The artwork of Andrea Diotallevi, a practising generative artist, creative coder, software engineer, architect and pianist"
            />
            <div className={portfolioStyles.container}>
                <ul>
                    {props.data.allArtworksJson.edges.map(({ node }) => (
                        <li key={node.name}>
                            <Link
                                to={`/portfolio/${node.slug}`}
                                className="artwork-link"
                            >
                                <Img
                                    fluid={node.images[0].childImageSharp.fluid}
                                    className={portfolioStyles.image}
                                />
                                <p>{node.name}</p>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </Layout>
    )
}

export default Portfolio
