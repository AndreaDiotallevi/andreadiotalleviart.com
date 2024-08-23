import { getAllProducts } from "../services/theprintspace"
import { ProductWithMetadata } from "../types/stripe"

export const getProducts = async () => {
    const theprintspaceProducts = await getAllProducts()

    const getProductByFilename = (fileName: string) => {
        const product = theprintspaceProducts.Data.find(
            product => product.FileName === fileName
        )

        if (!product) {
            throw new Error(
                `No theprintspace product found for filename ${fileName}`
            )
        }

        return product
    }

    return products.map(product => {
        const theprintspaceProduct = getProductByFilename(
            product.metadata.theprintspaceFilename
        )

        return {
            ...product,
            metadata: {
                ...product.metadata,
                theprintspaceProductId: theprintspaceProduct.Id,
                theprintspacePrintOptionId:
                    theprintspaceProduct.PrintOptions[0].Id,
            },
        }
    })
}

const products: Pick<
    ProductWithMetadata,
    "name" | "description" | "metadata"
>[] = [
    {
        name: "New York - A3 Giclée Fine Art Print",
        description:
            "A3 420 x 297 mm (16.5 x 11.7 inches) giclée fine art print on Hahnemühle photo rag 308gsm vegan certified matte paper.",
        metadata: {
            category: "prints",
            displayName: "New York",
            displayOrder: "3",
            orientation: "landscape",
            prodigiSku: "GLOBAL-HPR-A3",
            size: "A3",
            slug: "new-york",
            sku: "print-newYork-A3",
            theprintspaceFilename: "flames-A3-ok.png",
        },
    },
    {
        name: "New York - A2 Giclée Fine Art Print",
        description:
            "A2 594 x 420 mm (23.4 x 16.5 inches) giclée fine art print on Hahnemühle photo rag 308gsm vegan certified matte paper.",
        metadata: {
            category: "prints",
            displayName: "New York",
            displayOrder: "3",
            orientation: "landscape",
            prodigiSku: "GLOBAL-HPR-A2",
            size: "A2",
            slug: "new-york",
            sku: "print-newYork-A2",
            theprintspaceFilename: "flames-A3-ok.png",
        },
    },
    {
        name: "Moonlight 2 - A2 Giclée Fine Art Print",
        description:
            "A2 420 x 594 mm (16.5 x 23.4 inches) giclée fine art print on Hahnemühle photo rag 308gsm vegan certified matte paper.",
        metadata: {
            category: "prints",
            displayName: "Moonlight 2",
            displayOrder: "4",
            orientation: "portrait",
            prodigiSku: "GLOBAL-HPR-A2",
            size: "A2",
            slug: "moonlight-2",
            sku: "print-moonlight2-A2",
            theprintspaceFilename: "flames-A3-ok.png",
        },
    },
    {
        name: "Moonlight 2 - A3 Giclée Fine Art Print",
        description:
            "A3 297 x 420 mm (11.7 x 16.5 inches) giclée fine art print on Hahnemühle photo rag 308gsm vegan certified matte paper.",
        metadata: {
            category: "prints",
            displayName: "Moonlight 2",
            displayOrder: "4",
            orientation: "portrait",
            prodigiSku: "GLOBAL-HPR-A3",
            size: "A3",
            slug: "moonlight-2",
            sku: "print-moonlight2-A3",
            theprintspaceFilename: "flames-A3-ok.png",
        },
    },
    {
        name: "Marble Lake - A1 Giclée Fine Art Print",
        description:
            "A1 594 x 841 mm (23.4 x 33.1 inches) giclée fine art print on Hahnemühle photo rag 308gsm vegan certified matte paper.",
        metadata: {
            category: "prints",
            displayName: "Marble Lake",
            displayOrder: "2",
            orientation: "portrait",
            prodigiSku: "GLOBAL-HPR-A1",
            size: "A1",
            slug: "marble-lake",
            sku: "print-marbleLake-A1",
            theprintspaceFilename: "flames-A3-ok.png",
        },
    },
    {
        name: "Marble Lake - A2 Giclée Fine Art Print",
        description:
            "A2 420 x 594 mm (16.5 x 23.4 inches) giclée fine art print on Hahnemühle photo rag 308gsm vegan certified matte paper.",
        metadata: {
            category: "prints",
            displayName: "Marble Lake",
            displayOrder: "2",
            orientation: "portrait",
            prodigiSku: "GLOBAL-HPR-A2",
            size: "A2",
            slug: "marble-lake",
            sku: "print-marbleLake-A2",
            theprintspaceFilename: "flames-A3-ok.png",
        },
    },
    {
        name: "Marble Lake - A3 Giclée Fine Art Print",
        description:
            "A3 297 x 420 mm (11.7 x 16.5 inches) giclée fine art print on Hahnemühle photo rag 308gsm vegan certified matte paper.",
        metadata: {
            category: "prints",
            displayName: "Marble Lake",
            displayOrder: "2",
            orientation: "portrait",
            prodigiSku: "GLOBAL-HPR-A3",
            size: "A3",
            slug: "marble-lake",
            sku: "print-marbleLake-A3",
            theprintspaceFilename: "flames-A3-ok.png",
        },
    },
    {
        name: "Flames - A3 Giclée Fine Art Print",
        description:
            "A3 297 x 420 mm (11.7 x 16.5 inches) giclée fine art print on Hahnemühle photo rag 308gsm vegan certified matte paper.",
        metadata: {
            category: "prints",
            displayName: "Flames",
            displayOrder: "1",
            orientation: "portrait",
            prodigiSku: "GLOBAL-HPR-A3",
            size: "A3",
            slug: "flames",
            sku: "print-flames-A3",
            theprintspaceFilename: "flames-A3-ok.png",
        },
    },
]
