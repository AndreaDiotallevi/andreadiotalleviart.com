import { v2 as cloudinary } from "cloudinary"

cloudinary.config({
    cloud_name: import.meta.env.CLOUDINARY_CLOUD_NAME,
    api_key: import.meta.env.CLOUDINARY_API_KEY,
    api_secret: import.meta.env.CLOUDINARY_API_SECRET,
})

export const transformImage = (displayName: string) => {
    return cloudinary.url(displayName, {
        transformation: {
            quality: "auto",
            format: "auto",
        },
    })
}
