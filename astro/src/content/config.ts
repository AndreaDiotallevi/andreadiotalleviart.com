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

export const collections = {
    artworks: artworksCollection,
}
