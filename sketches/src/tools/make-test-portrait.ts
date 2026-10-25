// Generates a synthetic portrait so the five sketches can be run and compared without
// needing a personal photograph in the repository. Replace it with a real portrait via
// --input once you want the real thing.

import { mkdirSync } from "fs"
import { dirname } from "path"
import sharp from "sharp"

import { parseArgs, readNumber, readString } from "../lib/cli"

const WIDTH = 1050
const HEIGHT = 1485

const buildSvg = (): string => `
<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
    <defs>
        <linearGradient id="backdrop" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stop-color="#ffffff"/>
            <stop offset="1" stop-color="#e4e4e4"/>
        </linearGradient>
        <radialGradient id="skin" cx="0.38" cy="0.30" r="0.78">
            <stop offset="0" stop-color="#efeae5"/>
            <stop offset="0.55" stop-color="#c6bdb4"/>
            <stop offset="1" stop-color="#867c73"/>
        </radialGradient>
        <radialGradient id="hair" cx="0.4" cy="0.25" r="0.8">
            <stop offset="0" stop-color="#4a4a4a"/>
            <stop offset="1" stop-color="#161616"/>
        </radialGradient>
        <linearGradient id="shoulders" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stop-color="#5a5a5a"/>
            <stop offset="0.45" stop-color="#333333"/>
            <stop offset="1" stop-color="#1f1f1f"/>
        </linearGradient>
        <radialGradient id="vignette" cx="0.5" cy="0.45" r="0.75">
            <stop offset="0.6" stop-color="#000000" stop-opacity="0"/>
            <stop offset="1" stop-color="#000000" stop-opacity="0.09"/>
        </radialGradient>
        <radialGradient id="socket" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stop-color="#8d837c" stop-opacity="0.75"/>
            <stop offset="1" stop-color="#8d837c" stop-opacity="0"/>
        </radialGradient>
    </defs>

    <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#backdrop)"/>

    <ellipse cx="525" cy="1340" rx="500" ry="320" fill="url(#shoulders)"/>
    <path d="M 455 830 L 595 830 L 610 1040 L 440 1040 Z" fill="#b3aaa3"/>
    <ellipse cx="525" cy="1035" rx="105" ry="45" fill="#8c837c"/>

    <ellipse cx="525" cy="545" rx="272" ry="315" fill="url(#hair)"/>
    <ellipse cx="525" cy="620" rx="232" ry="298" fill="url(#skin)"/>
    <path d="M 293 505 Q 525 300 757 505 Q 700 355 525 330 Q 350 355 293 505 Z" fill="url(#hair)"/>

    <ellipse cx="430" cy="600" rx="95" ry="70" fill="url(#socket)"/>
    <ellipse cx="620" cy="600" rx="95" ry="70" fill="url(#socket)"/>

    <ellipse cx="430" cy="602" rx="46" ry="24" fill="#f6f4f2"/>
    <ellipse cx="620" cy="602" rx="46" ry="24" fill="#f6f4f2"/>
    <circle cx="434" cy="602" r="19" fill="#22201f"/>
    <circle cx="616" cy="602" r="19" fill="#22201f"/>
    <path d="M 384 566 Q 430 546 476 564" stroke="#2f2b28" stroke-width="9" fill="none" stroke-linecap="round"/>
    <path d="M 574 564 Q 620 546 666 566" stroke="#2f2b28" stroke-width="9" fill="none" stroke-linecap="round"/>

    <path d="M 525 630 Q 498 700 512 726 Q 525 736 538 726 Q 552 700 525 630 Z" fill="#b6ada6" opacity="0.85"/>
    <ellipse cx="525" cy="736" rx="42" ry="14" fill="#968d86" opacity="0.8"/>

    <path d="M 452 800 Q 525 776 598 800 Q 525 848 452 800 Z" fill="#7c6f6a"/>
    <path d="M 452 800 Q 525 812 598 800" stroke="#4d4340" stroke-width="6" fill="none"/>

    <ellipse cx="330" cy="710" rx="58" ry="120" fill="#7d746c" opacity="0.3"/>
    <ellipse cx="720" cy="710" rx="58" ry="120" fill="#7d746c" opacity="0.45"/>
    <ellipse cx="525" cy="880" rx="150" ry="60" fill="#7d746c" opacity="0.35"/>

    <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#vignette)"/>
</svg>
`

const handler = async () => {
    const args = parseArgs(process.argv.slice(2))
    const output = readString(args, "output", "input/portrait.png")
    const softness = readNumber(args, "softness", 1.1)

    mkdirSync(dirname(output), { recursive: true })

    await sharp(Buffer.from(buildSvg()))
        .blur(softness)
        .png({ compressionLevel: 9 })
        .toFile(output)

    console.log(`\nTest portrait written to ${output} (${WIDTH} x ${HEIGHT})`)
}

handler()
