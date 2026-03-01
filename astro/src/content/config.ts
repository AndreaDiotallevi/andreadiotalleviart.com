import { z, defineCollection } from "astro:content"

const sketchControlsSchema = z.object({
    noiseSeed: z.number().optional(),
    randomSeed: z.number().optional(),
})

const artworksCollection = defineCollection({
    type: "data",
    schema: z.object({
        slug: z.string(),
        name: z.string(),
        description: z.string(),
        images: z.array(z.string()),
    }),
})

const sketchesCollection = defineCollection({
    type: "data",
    schema: z.object({
        title: z.string(),
        date: z.string(),
        defaultControls: sketchControlsSchema.optional(),
    }),
})

export const collections = {
    artworks: artworksCollection,
    sketches: sketchesCollection,
}
