require("dotenv").config({
    path: `.env.${process.env.NODE_ENV}`,
})

module.exports = {
    siteMetadata: {
        title: "Andrea Diotallevi | Generative Artist and Creative Coder",
        author: "Andrea Diotallevi",
        description:
            "The artwork of Andrea Diotallevi, a practising generative artist, creative coder, software engineer, architect and pianist.",
        url: "https://www.andreadiotalleviart.com",
        image: "/moonlight.png",
        twitterUsername: "@adiotalleviart",
    },
    plugins: [
        "gatsby-plugin-react-helmet",
        "gatsby-plugin-sass",
        {
            resolve: "gatsby-source-filesystem",
            options: {
                name: "src",
                path: `${__dirname}/src/`,
            },
        },
        `gatsby-plugin-image`,
        "gatsby-plugin-sharp",
        "gatsby-transformer-sharp",
        "gatsby-transformer-json",
        {
            resolve: "gatsby-transformer-remark",
            options: {
                plugins: [
                    "gatsby-remark-relative-images",
                    {
                        resolve: "gatsby-remark-images",
                        options: {
                            maxWidth: 700,
                            linkImagesToOriginal: false,
                        },
                    },
                ],
            },
        },
        {
            resolve: `gatsby-plugin-google-fonts`,
            options: {
                fonts: [
                    // "Work Sans:400,500,600,700",
                    // "Lato:400,500,600,700",
                    // "Rubik:400,500,600,700",
                    "Nunito:500,700",
                ],
                display: "swap",
            },
        },
        {
            resolve: `gatsby-plugin-google-gtag`,
            options: {
                trackingIds: [
                    process.env.GA_TRACKING_ID,
                    process.env.GA4_TRACKING_ID,
                ],
                pluginConfig: {
                    head: true,
                },
            },
        },
    ],
}
