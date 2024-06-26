import React, { useState } from "react"
import { graphql, PageProps, Link } from "gatsby"
import { GatsbyImage } from "gatsby-plugin-image"

import Seo from "../components/seo"
import Layout from "./layout"
import { Artwork } from "../models/artworks"

import * as styles from "./showcase.module.scss"

type DataProps = {
    artworksJson: Artwork
}

const ArtworkPage = ({ data: { artworksJson } }: PageProps<DataProps>) => {
    const [slideShowIndex, setSliderShowIndex] = useState(0)

    return (
        <Layout>
            <div className={styles.container}>
                <div className={styles.linksContainer}>
                    <Link
                        to="/portfolio"
                        className={styles.backButtonContainer}
                    >
                        <div className={styles.backButtonIcon} />
                        <p className={styles.linkText}>Back to Portfolio</p>
                    </Link>
                    {/* <Link to="/shop" className={styles.nextButtonContainer}>
                        <p className={styles.linkText}>Shop</p>
                        <div className={styles.nextButtonIcon} />
                    </Link> */}
                </div>
                <div className={styles.grid}>
                    <div className={styles.gridItem1}>
                        <div
                            className={styles.mainImage}
                            onClick={() =>
                                setSliderShowIndex(
                                    (slideShowIndex + 1) %
                                        artworksJson.images.length,
                                )
                            }
                        >
                            <GatsbyImage
                                alt={artworksJson.images[slideShowIndex].id}
                                image={
                                    artworksJson.images[slideShowIndex]
                                        .childImageSharp.gatsbyImageData
                                }
                            />
                        </div>
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
                                            alt={artworksJson.images[index].id}
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
                        <h1 className={styles.h1}>{artworksJson.name}</h1>
                        <p>{artworksJson.description}</p>
                    </div>
                </div>
            </div>
        </Layout>
    )
}

export default ArtworkPage

export const query = graphql`
    query ($slug: String!) {
        artworksJson(slug: { eq: $slug }) {
            ...ArtworkFragment
        }
    }
`

export const Head = ({ data: { artworksJson } }: PageProps<DataProps>) => (
    <Seo
        title={`${artworksJson.name} | Andrea Diotallevi Art`}
        description={artworksJson.description}
        image={artworksJson.images[0].childImageSharp.original.src}
        tags={[
            artworksJson.name,
            "Generative Art",
            "p5.js",
            "Processing",
            "Procedural",
            "Prints",
            "Giclee",
        ]}
    />
)
