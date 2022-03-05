import React from "react"
import { Link } from "gatsby"
import { graphql } from "gatsby"
import Img from "gatsby-image"

import Layout from "../templates/layout"
import Seo from "../components/seo"
import PageTitle from "../components/pageTitle"

import * as portfolioStyles from "./portfolio.module.scss"

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

const Portfolio = props => {
    return (
        <Layout>
            <Seo
                title="Portfolio | Andrea Diotallevi"
                description="The artwork of Andrea Diotallevi, a practising generative artist, creative coder, software engineer, architect and pianist"
            />
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    width: "100%",
                    marginBottom: "50px",
                }}
            >
                <PageTitle isHome={false} text="Generative Art" />
                <div>
                    <ul className={portfolioStyles.container}>
                        {props.data.allArtworksJson.edges.map(({ node }) => (
                            <li key={node.name}>
                                <Link to={`/portfolio/${node.slug}`}>
                                    <Img
                                        fluid={
                                            node.images[0].childImageSharp.fluid
                                        }
                                    />
                                    <h2>{node.name}</h2>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </Layout>
    )
}

export default Portfolio
