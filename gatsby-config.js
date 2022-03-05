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
                // cssLoaderOptions: {
                //     esModule: false,
                //     modules: {
                //         namedExport: false,
                //     },
                // },
            },
        },
        "gatsby-plugin-sharp",
        "gatsby-transformer-sharp",
        "gatsby-transformer-json",
        {
            resolve: "gatsby-transformer-remark",
            options: {
                plugins: [
                    // "gatsby-remark-reading-time",
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
                fonts: ["Work Sans:400,600,700"],
                display: "swap",
            },
        },
        {
            resolve: `gatsby-plugin-google-analytics`,
            options: {
                trackingId: process.env.GA_TRACKING_ID,
            },
        },
    ],
}
