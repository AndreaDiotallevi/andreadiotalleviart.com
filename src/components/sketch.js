const Sketch = (p5) => {
    let t = 0

    p5.setup = (canvasParentRef) => {
        const height = document.getElementById("moonlight-container").offsetHeight
        const width = document.getElementById("moonlight-container").offsetWidth
        p5.createCanvas(width, height).parent(canvasParentRef)
        p5.background(56, 68, 76)
    }

    p5.draw = () => {
        if (t > 0) {
            const height = document.getElementById("moonlight-container").offsetHeight
            const width = document.getElementById("moonlight-container").offsetWidth

            p5.translate(width / 2, height / 2)
            const w = p5.min(width, height)
            const n = p5.noise

            const a = 0.48 * w
            let b = n(t) * 6
            let c = n(t + 60) * 6

            p5.noFill()
            p5.stroke(255, 25)
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
        const height = document.getElementById("moonlight-container").offsetHeight
        const width = document.getElementById("moonlight-container").offsetWidth
        p5.resizeCanvas(width, height)
        p5.noiseSeed(p5.random())
        p5.background(56, 68, 76)
        t = 0
        p5.draw()
    }
}

export default Sketch
