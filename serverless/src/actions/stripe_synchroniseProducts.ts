import Stripe from "stripe"
import { v2 as cloudinary } from "cloudinary"
import { initialiseClient } from "./stripe_initialiseClient"
import { getAllProducts } from "./theprintspace_getAllProducts"

import { StripePrice } from "../types/stripe"

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
})

const transformImage = (displayName: string) => {
    return cloudinary.url(displayName, {
        transformation: {
            quality: "auto",
            format: "auto",
        },
    })
}

export const stripeSynchroniseProducts = async () => {
    const stripe = await initialiseClient()

    const stripeProducts = await stripe.products.list({
        active: true,
        expand: ["data.default_price", "data.default_price.currency_options"],
    })

    const products = await getProducts()

    for (const product of products) {
        console.log("Input product: ", product.metadata.sku)

        const payload = {
            name: product.name,
            active: product.active,
            description: product.description,
            metadata: product.metadata,
            images: product.images,
        }

        const stripeProduct = stripeProducts.data.find(
            p => product.metadata.sku === p.metadata.sku
        )

        if (stripeProduct) {
            console.log("Updating existing product...")

            await stripe.products.update(stripeProduct.id, payload)

            const defaultPrice = stripeProduct.default_price as Stripe.Price

            const defaultPriceNeedUpdating =
                defaultPrice.currency_options?.gbp?.unit_amount !==
                    product.currencyOptions.gbp ||
                defaultPrice.currency_options?.eur?.unit_amount !==
                    product.currencyOptions.eur ||
                defaultPrice.currency_options?.usd?.unit_amount !==
                    product.currencyOptions.usd

            if (defaultPriceNeedUpdating) {
                console.log("Updating default price...")
                const newPrice = await stripe.prices.create({
                    active: true,
                    product: stripeProduct.id,
                    currency: "gbp",
                    unit_amount: product.currencyOptions.gbp,
                    currency_options: {
                        eur: { unit_amount: product.currencyOptions.eur },
                        usd: { unit_amount: product.currencyOptions.usd },
                    },
                })

                await stripe.products.update(stripeProduct.id, {
                    default_price: newPrice.id,
                })

                await stripe.prices.update(defaultPrice.id, { active: false })
            }
        } else {
            console.log("Creating new product...")

            await stripe.products.create({
                ...payload,
                default_price_data: {
                    currency: "gbp",
                    unit_amount: product.currencyOptions.gbp,
                    currency_options: {
                        eur: { unit_amount: product.currencyOptions.eur },
                        usd: { unit_amount: product.currencyOptions.usd },
                    },
                },
            })
        }
    }

    console.log("Products synchronized successfully")
}

const getProducts = async (): Promise<ProductInput[]> => {
    const theprintspaceProducts = await getAllProducts()

    const getProductByFilename = (fileName: string) => {
        const product = theprintspaceProducts.Data.find(
            product => product.FileName === fileName
        )

        return product
    }

    return products.map(product => {
        let theprintspaceProduct = getProductByFilename(
            product.metadata.sku + ".png"
        )

        if (product.active && !theprintspaceProduct) {
            if (process.env.ENVIRONMENT === "production") {
                throw new Error(
                    `No theprintspace product found for sku ${product.metadata.sku}`
                )
            }
        }

        return {
            ...product,
            metadata: {
                ...product.metadata,
                theprintspaceProductId: String(theprintspaceProduct?.Id),
                theprintspacePrintOptionId: String(
                    theprintspaceProduct?.PrintOptions[0].Id
                ),
            },
        }
    })
}

type ProductInput = Pick<
    StripePrice["product"],
    "name" | "description" | "active" | "images"
> & {
    metadata: Pick<
        StripePrice["product"]["metadata"],
        | "category"
        | "displayName"
        | "displayOrder"
        | "orientation"
        | "size"
        | "slug"
        | "sku"
    >
} & {
    currencyOptions: { gbp: number; eur: number; usd: number }
}

const products: ProductInput[] = [
    {
        active: false,
        name: "Marble Lake - A3 Giclée Fine Art Print",
        description:
            "A3 (297 x 420 mm) giclée fine art print on Hahnemühle photo rag 308gsm matte paper.",
        metadata: {
            category: "prints",
            displayName: "Marble Lake",
            displayOrder: "20",
            orientation: "portrait",
            size: "A3",
            slug: "marble-lake",
            sku: "print-marbleLake-A3",
        },
        images: [
            transformImage("marble-lake_WEB_MOCKUP_WITHOUT_BORDER_b4p8fc"),
            transformImage("marble-lake_WEB_WITHOUT_BORDER_k9tcgo"),
            transformImage("A116-marble-lake_nmaccx"),
        ],
        currencyOptions: {
            gbp: 6500,
            eur: 8000,
            usd: 9000,
        },
    },
    {
        active: false,
        name: "Flames - A3 Giclée Fine Art Print",
        description:
            "A3 (297 x 420 mm) giclée fine art print on Hahnemühle photo rag 308gsm matte paper.",
        metadata: {
            category: "prints",
            displayName: "Flames",
            displayOrder: "21",
            orientation: "portrait",
            size: "A3",
            slug: "flames",
            sku: "print-flames-A3",
        },
        images: [
            transformImage("flames-mockup_gzj45v"),
            transformImage("flames-artwork_ioxny4"),
            transformImage("A116-flames_voptyx"),
        ],
        currencyOptions: {
            gbp: 6500,
            eur: 8000,
            usd: 9000,
        },
    },
    {
        active: false,
        name: "Moonlight 1 - A3 Giclée Fine Art Print",
        description:
            "A3 (297 x 420 mm) giclée fine art print on Hahnemühle photo rag 308gsm matte paper.",
        metadata: {
            category: "prints",
            displayName: "Moonlight 1",
            displayOrder: "22",
            orientation: "portrait",
            size: "A3",
            slug: "moonlight-1",
            sku: "print-moonlight1-A3",
        },
        images: [
            transformImage("moonlight-1_MOCKUP_xul3pi"),
            transformImage("moonlight-1_WEB_WITHOUT_BORDER_ecwgkl"),
            transformImage("moonlight-1_PAPER_cdhgj9"),
        ],
        currencyOptions: {
            gbp: 6500,
            eur: 8000,
            usd: 9000,
        },
    },
    {
        active: false,
        name: "Moonlight 2 - A3 Giclée Fine Art Print",
        description:
            "A3 (297 x 420 mm) giclée fine art print on Hahnemühle photo rag 308gsm matte paper.",
        metadata: {
            category: "prints",
            displayName: "Moonlight 2",
            displayOrder: "23",
            orientation: "portrait",
            size: "A3",
            slug: "moonlight-2",
            sku: "print-moonlight2-A3",
        },
        images: [
            transformImage("moonlight-2_WEB_MOCKUP_WITHOUT_BORDER_aenrjl"),
            transformImage("moonlight-2_WEB_WITHOUT_BORDER_sh02uz"),
            transformImage("moonlight-2_WEB_PAPER_jzx3xu"),
        ],
        currencyOptions: {
            gbp: 6500,
            eur: 8000,
            usd: 9000,
        },
    },
    {
        active: true,
        name: "Nebulae #3 - 50x70cm Giclée Fine Art Print",
        description:
            "50x70cm giclée fine art print on Hahnemühle photo rag 308gsm matte paper.",
        metadata: {
            category: "prints",
            displayName: "Nebulae #3",
            displayOrder: "1",
            orientation: "portrait",
            size: "50x70cm",
            slug: "nebulae-3",
            sku: "nebulae-3-50x70",
        },
        images: [
            transformImage("nebulae-mockup-with-border-3-portrait_adkdeh"),
            transformImage("nebula-width2000-variation3_dbs4mr"),
        ],
        currencyOptions: {
            gbp: 10000,
            eur: 12000,
            usd: 13000,
        },
    },
]
