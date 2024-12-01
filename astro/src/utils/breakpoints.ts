// From Unpic
const DEFAULT_RESOLUTIONS = [
    6016, // 6K
    5120, // 5K
    4480, // 4.5K
    3840, // 4K
    3200, // QHD+
    2560, // WQXGA
    2048, // QXGA
    1920, // 1080p
    1668, // Various iPads
    1280, // 720p
    1080, // iPhone 6-8 Plus
    960, // older horizontal phones
    828, // iPhone XR/11
    750, // iPhone 6-8
    640, // older and lower-end phones

    // Additional for mobile
    500,
    400,
    300,
]

export const imageBreakpoints = (imageWidth: number) => {
    const srcsetArr = DEFAULT_RESOLUTIONS.filter(res => res <= imageWidth * 2)

    srcsetArr.push(imageWidth)

    return srcsetArr
}