import { z, defineCollection } from "astro:content"

const artworksCollection = defineCollection({
    type: "data",
    schema: z.object({
        slug: z.string(),
        name: z.string(),
        description: z.string(),
        images: z.array(z.string()),
    }),
})

const articlesCollection = defineCollection({
    type: "content",
    schema: z.object({
        title: z.string(),
        description: z.string(),
        pubDate: z.coerce.date().optional(),
        draft: z.boolean().optional().default(false),
        image: z.string().optional(),
    }),
})

export const collections = {
    artworks: artworksCollection,
    articles: articlesCollection,
}
