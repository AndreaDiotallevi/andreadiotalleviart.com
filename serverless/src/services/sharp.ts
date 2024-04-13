import sharp from "sharp"

export const addBorder = async (imagePath: string, outputPath: string) => {
    const image = sharp(imagePath)
    const metadata = await image.metadata()

    // Calculate border size as 5% of the larger side divided by the A3 aspect ratio
    const largerSide = Math.max(metadata.width!, metadata.height!)
    const borderSize = Math.floor((largerSide / 1.414) * 0.05) // Using the A3 aspect ratio

    const newWidth = metadata.width! + 2 * borderSize // New dimensions including border
    const newHeight = metadata.height! + 2 * borderSize

    // Calculate the target aspect ratio
    const originalAspectRatio = metadata.width! / metadata.height!
    const newAspectRatio = newWidth / newHeight

    let resizedWidth: number, resizedHeight: number
    if (originalAspectRatio === 1) {
        // Image is square, no need to resize differently
        resizedWidth = newWidth
        resizedHeight = newHeight
    } else {
        // Maintain the aspect ratio of the original image
        if (newAspectRatio > originalAspectRatio) {
            // New dimensions are too wide
            resizedWidth = Math.round(newHeight * originalAspectRatio)
            resizedHeight = newHeight
        } else {
            // New dimensions are too tall
            resizedWidth = newWidth
            resizedHeight = Math.round(newWidth / originalAspectRatio)
        }
    }

    // Resize the image to maintain aspect ratio before adding border
    const resizedImage = await image
        .resize(resizedWidth - 2 * borderSize, resizedHeight - 2 * borderSize)
        .toBuffer()

    // Now add the border
    const outputImage = await sharp(resizedImage)
        .extend({
            top: borderSize,
            bottom: borderSize,
            left: borderSize,
            right: borderSize,
            background: { r: 255, g: 255, b: 255, alpha: 1 }, // White border
        })
        .toFile(outputPath)

    return outputImage
}

export const cropToVerticalA3Ratio = async (
    imagePath: string,
    outputPath: string
) => {
    const image = sharp(imagePath)
    const metadata = await image.metadata()

    // Keeping the height constant, calculate the width to maintain a vertical A3 ratio
    const targetHeight = metadata.height! // Keep original height
    const verticalA3Ratio = 297 / 420 // A3 ratio (width to height)
    const targetWidth = Math.floor(targetHeight * verticalA3Ratio) // Calculate new width

    // Calculating the top left corner of the crop box for width to ensure it is centered
    const left = Math.floor((metadata.width! - targetWidth) / 2)
    const top = 0 // Top remains 0 since height is unchanged

    // Crop the image to the calculated width while maintaining original height
    const outputImage = await image
        .extract({
            left: left,
            top: top,
            width: targetWidth,
            height: targetHeight,
        })
        .toFile(outputPath)

    return outputImage
}

export const createThumbnail = async (
    imagePath: string,
    outputPath: string
) => {
    const targetWidth = 400 // Set target width for the thumbnail
    const quality = 90 // Set a default high-quality compression

    // Resize the image and convert to JPEG
    await sharp(imagePath)
        .resize(targetWidth) // Resize to width of 500px, height is auto to maintain aspect ratio
        .jpeg({ quality }) // Convert to JPEG with specified quality
        .toFile(outputPath) // Save the output to a file
        .then(() => {
            console.log("Thumbnail created successfully.")
        })
        .catch(err => {
            console.error("Error creating thumbnail:", err)
        })
}

export const createWebImage = async (imagePath: string, outputPath: string) => {
    const targetWidth = 1000 // Set target width for the thumbnail

    // Resize the image and convert to JPEG
    await sharp(imagePath)
        .resize(targetWidth) // Resize to width of 500px, height is auto to maintain aspect ratio
        .toFile(outputPath) // Save the output to a file
        .then(() => {
            console.log("Thumbnail created successfully.")
        })
        .catch(err => {
            console.error("Error creating thumbnail:", err)
        })
}
