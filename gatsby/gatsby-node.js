const path = require("path")
const { createRemoteFileNode } = require("gatsby-source-filesystem")

require("dotenv").config({
    path: `.env.${process.env.NODE_ENV}`,
})

module.exports.createSchemaCustomization = ({ actions }) => {
    const { createTypes } = actions

    createTypes(`
        type StripePrice implements Node {
            artwork: File @link(from: "fields.artwork")
            mockup: File @link(from: "fields.mockup")
        }
  `)
}

module.exports.onCreateNode = async ({
    node,
    actions,
    createNodeId,
    getCache,
}) => {
    const { createNode, createNodeField } = actions

    if (node.internal.type === "MarkdownRemark") {
        const slug = path.basename(node.fileAbsolutePath, ".md")

        createNodeField({
            node,
            name: "slug",
            value: slug,
        })
    }

    const externalImages = [
        { key: "artwork", value: "_WEB_WITHOUT_BORDER.png" },
        { key: "mockup", value: "_WEB_MOCKUP.png" },
    ]

    if (node.internal.type === "StripePrice" && node.product?.metadata?.slug) {
        externalImages.forEach(async ({ key, value }) => {
            const fileNode = await createRemoteFileNode({
                url: `${process.env.IMAGES_DOMAIN}/prints/${node.product.metadata.slug}${value}`,
                parentNodeId: node.id,
                createNode,
                createNodeId,
                getCache,
            })

            if (fileNode) {
                createNodeField({
                    node,
                    name: key,
                    value: fileNode.id,
                })
            }
        })
    }
}

module.exports.createPages = async ({ graphql, actions }) => {
    const { createPage } = actions
    const artworkTemplate = path.resolve("./src/templates/artwork.tsx")
    const priceTemplate = path.resolve("./src/templates/price.tsx")

    const res = await graphql(`
        query {
            allMarkdownRemark {
                edges {
                    node {
                        fields {
                            slug
                        }
                    }
                }
            }
            allArtworksJson {
                edges {
                    node {
                        slug
                    }
                }
            }
            allStripeProduct(filter: { active: { eq: true } }) {
                edges {
                    node {
                        metadata {
                            category
                            size
                            slug
                        }
                    }
                }
            }
        }
    `)

    res.data.allArtworksJson.edges.forEach(edge => {
        createPage({
            component: artworkTemplate,
            path: `/portfolio/${edge.node.slug}`,
            context: {
                slug: edge.node.slug,
            },
        })
    })

    res.data.allStripeProduct.edges.forEach(edge => {
        createPage({
            component: priceTemplate,
            path: `/shop/${edge.node.metadata.category}/${edge.node.metadata.slug}`,
            context: {
                slug: edge.node.metadata.slug,
            },
        })
    })
}
