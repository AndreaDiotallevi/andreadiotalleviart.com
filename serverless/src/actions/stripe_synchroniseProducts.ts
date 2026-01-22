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
        | "displaySubtitle"
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
            displaySubtitle: "",
            orientation: "portrait",
            size: "A3",
            slug: "marble-lake",
            sku: "print_marble-lake_A3",
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
        active: true,
        name: "Flames - A3 Giclée Fine Art Print",
        description:
            "A3 (297 x 420 mm) giclée fine art print on Hahnemühle photo rag 308gsm matte paper.",
        metadata: {
            category: "prints",
            displayName: "Flames",
            displaySubtitle: "",
            displayOrder: "4",
            orientation: "portrait",
            size: "A3",
            slug: "flames",
            sku: "print_flames_A3",
        },
        images: [
            // transformImage("flames-mockup_gzj45v"),
            transformImage("flames-artwork_ioxny4"),
            // transformImage("flames-mockup-2_veo56n"),
            transformImage("flames-mockup-2_ysiocl"),
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
            displaySubtitle: "",
            displayOrder: "22",
            orientation: "portrait",
            size: "A3",
            slug: "moonlight-1",
            sku: "print_moonlight-1_A3",
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
            displaySubtitle: "",
            displayOrder: "23",
            orientation: "portrait",
            size: "A3",
            slug: "moonlight-2",
            sku: "print_moonlight-2_A3",
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
        name: "Nebula 1 - 50x70cm Giclée Fine Art Print",
        description:
            "50x70cm giclée fine art print on Hahnemühle photo rag 308gsm matte paper.",
        metadata: {
            category: "prints",
            displayName: "Nebula 1",
            displaySubtitle: "First of a series of 3",
            displayOrder: "1",
            orientation: "portrait",
            size: "50x70cm",
            slug: "nebula-1",
            sku: "print_nebula-1_50x70",
        },
        images: [
            // transformImage("nebulae-mockup-paper-1_gvzthk"),
            transformImage("nebulae1_tiboq3"),
            transformImage("nebulae-mockup-with-border-1-portrait_n8x30i"),
            transformImage("mockup-series-vertical_hpqksb"),
            transformImage("A116-nebula1_dxzgjj"),
            transformImage("IMG_5220_cizhq8"),
        ],
        currencyOptions: {
            gbp: 8500,
            eur: 10000,
            usd: 11000,
        },
    },
    {
        active: true,
        name: "Nebula 2 - 50x70cm Giclée Fine Art Print",
        description:
            "50x70cm giclée fine art print on Hahnemühle photo rag 308gsm matte paper.",
        metadata: {
            category: "prints",
            displayName: "Nebula 2",
            displaySubtitle: "Second of a series of 3",
            displayOrder: "2",
            orientation: "portrait",
            size: "50x70cm",
            slug: "nebula-2",
            sku: "print_nebula-2_50x70",
        },
        images: [
            // transformImage("nebulae-mockup-paper-2_mynxf0"),
            transformImage("nebulae2_unlnm2"),
            transformImage("nebulae-mockup-with-border-2-portrait_yzrf1b"),
            transformImage("mockup-series-vertical_hpqksb"),
            transformImage("A116-nebula2_fsxqu9"),
            transformImage("IMG_5224_fqexh6"),
        ],
        currencyOptions: {
            gbp: 8500,
            eur: 10000,
            usd: 11000,
        },
    },
    {
        active: true,
        name: "Nebula 3 - 50x70cm Giclée Fine Art Print",
        description:
            "50x70cm giclée fine art print on Hahnemühle photo rag 308gsm matte paper.",
        metadata: {
            category: "prints",
            displayName: "Nebula 3",
            displaySubtitle: "Third of a series of 3",
            displayOrder: "3",
            orientation: "portrait",
            size: "50x70cm",
            slug: "nebula-3",
            sku: "print_nebula-3_50x70",
        },
        images: [
            // transformImage("nebulae-mockup-paper-3_kq6yok"),
            transformImage("nebulae3_y5qb1g"),
            transformImage('nebulae-mockup-with-border-3-portrait_adkdeh'),
            transformImage("mockup-series-vertical_hpqksb"),
            transformImage("A116-nebula3_bpr7wh"),
            transformImage("IMG_5198_pzut4l"),
            // transformImage("nebulae-3_closeup_or5o0e")
        ],
        currencyOptions: {
            gbp: 8500,
            eur: 10000,
            usd: 11000,
        },
    },
]
