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
    const blogTemplate = path.resolve("./src/templates/blog.tsx")
    const artworkTemplate = path.resolve("./src/templates/artwork.tsx")

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
        }
    `)

    res.data.allMarkdownRemark.edges.forEach(edge => {
        createPage({
            component: blogTemplate,
            path: `/blog/${edge.node.fields.slug}`,
            context: {
                slug: edge.node.fields.slug,
            },
        })
    })

    res.data.allArtworksJson.edges.forEach(edge => {
        createPage({
            component: artworkTemplate,
            path: `/portfolio/${edge.node.slug}`,
            context: {
                slug: edge.node.slug,
            },
        })
    })

    // 1. Get path to template
    // 2. Get markdown data
    // 3. Create new pages
}

module.exports.onCreatePage = async ({ page, actions: { deletePage } }) => {
    if (page.path.match(/^\/blog/)) {
        deletePage(page)
    }
}
