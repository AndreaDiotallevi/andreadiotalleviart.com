import {
    addBorder,
    createThumbnail,
    createWebImage,
    cropToVerticalA3Ratio,
} from "../services/sharp"

export const handler = async () => {
    const name = "marble-lake"

    await cropToVerticalA3Ratio(
        `./${name}.png`,
        `./${name}_PRODUCTION_WITHOUT_BORDER.png`
    )

    await addBorder(
        `./${name}_PRODUCTION_WITHOUT_BORDER.png`,
        `./${name}_PRODUCTION_WITH_BORDER.png`
    )

    await createWebImage(
        `./${name}_PRODUCTION_WITHOUT_BORDER.png`,
        `./${name}_WEB_WITHOUT_BORDER.png`
    )

    await createWebImage(
        `./${name}_PRODUCTION_WITH_BORDER.png`,
        `./${name}_WEB_WITH_BORDER.png`
    )

    // await createThumbnail(
    //     `./${name}_WEB_MOCKUP.png`,
    //     `./${name}_WEB_THUMBNAIL.jpg`
    // )
}

handler()

// npx ts-node ./src/scripts/sharpGenerateImages.ts
