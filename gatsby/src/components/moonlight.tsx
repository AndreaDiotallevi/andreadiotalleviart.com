import React from "react"
import { type Sketch } from "@p5-wrapper/react"
import { NextReactP5Wrapper } from "@p5-wrapper/next"

const sketch: Sketch = p5 => {
    let t = 0

    p5.setup = () => {
        p5.createCanvas(p5.windowWidth, p5.windowHeight - 300)
        p5.stroke(255, 25)
        p5.noFill()
    }

    p5.draw = () => {
        if (t > 0) {
            p5.translate(p5.width / 2, p5.height / 2)
            const n = p5.noise
            const a = 0.48 * p5.min(p5.width, p5.height)
            let b = n(t) * 6
            let c = n(t + 60) * 6
            p5.line(p5.cos(b) * a, p5.sin(b) * a, p5.cos(c) * a, p5.sin(c) * a)
        }
        t++
    }

    p5.mouseClicked = () => {
        p5.noiseSeed(p5.random(1000))
        p5.background(56, 68, 76)
        t = 0
        p5.draw()
    }

    p5.windowResized = () => {
        p5.resizeCanvas(p5.windowWidth, p5.windowHeight)
        t = 0
        p5.draw()
    }
}

const Moonlight = () => {
    return <NextReactP5Wrapper sketch={sketch} />
}

export default Moonlight
