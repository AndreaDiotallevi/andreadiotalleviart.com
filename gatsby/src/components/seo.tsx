import React from "react"
import { useLocation } from "@reach/router"
import { useStaticQuery, graphql } from "gatsby"

type DataProps = {
    title: string
    description: string
    image?: string
    tags: string[]
    type?: "website" | "product"
}

const SEO = (props: DataProps) => {
    const { title, description, image, type = "website", tags } = props
    const { pathname } = useLocation()
    const { site } = useStaticQuery(query)

    const removeTrailingSlash = (str: string): string => {
        const length = str.length

        if (str[length - 1] === "/") {
            return str.slice(0, length - 1)
        }

        return str
    }

    const {
        defaultTitle,
        defaultDescription,
        siteUrl,
        defaultImage,
        twitterUsername,
    } = site.siteMetadata

    const seo = {
        title: title || defaultTitle,
        description: description || defaultDescription,
        image: `${siteUrl}${image || defaultImage}`,
        url: `${siteUrl}${pathname}`,
    }

    return (
        <>
            <html lang="en" />
            <title>{seo.title}</title>
            <meta name="description" content={seo.description} />
            <meta name="keywords" content={tags.join(", ")} />
            <meta name="image" content={seo.image} />
            <meta property="og:url" content={removeTrailingSlash(seo.url)} />
            <meta property="og:type" content={type} />
            <meta property="og:title" content={seo.title} />
            <meta property="og:description" content={seo.description} />
            <meta property="og:image" content={seo.image} />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:creator" content={twitterUsername} />
            <meta name="twitter:title" content={seo.title} />
            <meta name="twitter:description" content={seo.description} />
            <meta name="twitter:image" content={seo.image} />
            <meta
                name="google-site-verification"
                content="L9kVJc3DVgxLFGpwKd4inoCjGO9kEnixH9fUaC4DEYY"
            />
        </>
    )
}

export default SEO

const query = graphql`
    query SEO {
        site {
            siteMetadata {
                defaultTitle: title
                defaultDescription: description
                siteUrl: url
                defaultImage: image
                twitterUsername
            }
        }
    }
`
