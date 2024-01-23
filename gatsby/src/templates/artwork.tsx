import React, { useState } from "react"
import { graphql, PageProps, Link } from "gatsby"
import { GatsbyImage, IGatsbyImageData } from "gatsby-plugin-image"

import Layout from "./layout"

import * as styles from "./price.module.scss"

type DataProps = {
    artworksJson: {
        name: string
        description: string
        images: [
            {
                childImageSharp: {
                    gatsbyImageData: IGatsbyImageData
                    fixed: {
                        src: string
                    }
                }
            }
        ]
    }
}

const Artwork = ({ data: { artworksJson } }: PageProps<DataProps>) => {
    const [slideShowIndex, setSliderShowIndex] = useState(0)

    return (
        <Layout
            seo={{
                title: `${artworksJson.name} | Andrea Diotallevi`,
                description: artworksJson.description,
                tags: [
                    artworksJson.name,
                    "Generative Art",
                    "p5.js",
                    "Processing",
                    "Procedural",
                    "Print",
                    "Giclee",
                ],
            }}
        >
            <div className={styles.container}>
                <h1 className={styles.h1}>{artworksJson.name}</h1>
                <Link to="/portfolio" className={styles.backButtonContainer}>
                    <div className={styles.backButtonIcon} />
                    <p className={styles.backButtonText}>Portfolio</p>
                </Link>
                <div className={styles.grid}>
                    <div className={styles.gridItem1}>
                        <GatsbyImage
                            // alt={artworksJson.images[slideShowIndex].id}
                            alt="test"
                            image={
                                artworksJson.images[slideShowIndex]
                                    .childImageSharp.gatsbyImageData
                            }
                        />
                        {artworksJson.images.length > 1 ? (
                            <ul className={styles.imageList}>
                                {artworksJson.images.map((image, index) => (
                                    <li
                                        key={`image-${index}`}
                                        onClick={() =>
                                            setSliderShowIndex(index)
                                        }
                                        className={`${styles.imageListItem} ${
                                            slideShowIndex === index
                                                ? styles.active
                                                : ""
                                        }`}
                                    >
                                        <GatsbyImage
                                            // alt={artworksJson.images[index].id}
                                            alt="test"
                                            image={
                                                image.childImageSharp
                                                    .gatsbyImageData
                                            }
                                        />
                                    </li>
                                ))}
                            </ul>
                        ) : null}
                    </div>
                    <div className={styles.gridItem2}>
                        <h2>Description</h2>
                        <p>{artworksJson.description}</p>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default Artwork

export const query = graphql`
    query($slug: String!) {
        artworksJson(slug: { eq: $slug }) {
            name
            description
            images {
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
    }
`
