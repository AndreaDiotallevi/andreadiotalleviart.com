const path = require("path")

module.exports.onCreateNode = ({ node, actions }) => {
    const { createNodeField } = actions

    if (node.internal.type === "MarkdownRemark") {
        const slug = path.basename(node.fileAbsolutePath, ".md")

        createNodeField({
            node,
            name: "slug",
            value: slug,
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
            allStripeProduct {
                edges {
                    node {
                        metadata {
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
            path: `/shop/${edge.node.metadata.slug}`,
            context: {
                slug: edge.node.metadata.slug,
            },
        })
    })
}
