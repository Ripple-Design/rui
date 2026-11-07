import { defineCollection, defineContentConfig, z } from "@nuxt/content"

const localeSchema = z.enum(["en", "zh-cn"])
const tabSchema = z.enum(["spec", "guidelines", "implementation"])

export default defineContentConfig({
    collections: {
        docs: defineCollection({
            type: "page",
            source: "docs/**/*.md",
            schema: z.object({
                title: z.string(),
                docSlug: z.string(),
                tab: tabSchema,
                locale: localeSchema,
                designOrder: z.number(),
                developOrder: z.number(),
                api: z.string(),
            }),
        }),
        api: defineCollection({
            type: "page",
            source: "api/**/*.md",
            schema: z.object({
                title: z.string(),
                routeSlug: z.string(),
                locale: localeSchema,
                docs: z.string(),
                designOrder: z.number(),
                developOrder: z.number(),
            }),
        }),
    },
})
