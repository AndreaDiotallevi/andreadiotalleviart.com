---
title: The Nebula series — how it’s made
description: "How the Nebula generative series works: circles in fixed positions, growing in size, against a background that shifts in warmth."
pubDate: 2025-01-31
---

The Nebula series started from a simple idea: **generate a set of circles once, keep them in the same positions, then vary their size and the warmth of the background.** Because each run is deterministic (same seeds → same layout), you can tweak just a couple of knobs and get a whole series. The sketch is written in p5.js:

```ts
p5.setup = () => {
  p5.createCanvas(width, height)
  p5.colorMode("hsb", 360, 100, 100, 1)
  p5.noStroke()
  p5.noLoop()
}
```

## The core idea

The image is just lots of small circles. They’re not random—they sit in **concentric rings** that spread out from the centre. Each ring has:

- Its own **colour** (a random hue, full saturation and brightness),
- Its own **transparency** (from a Gaussian so most circles are semi‑transparent, with a bit of variation),
- **Fixed positions** from two seeds (random + noise), so the same seeds always give you the same “constellation”.

The **background** is a single solid hue—warm orange, cool blue, whatever. That hue does most of the work for mood; the circles sit on top and blend in via transparency.

So in practice: **circles generated once, same positions every time; you change scale (size/density) and hue (background warmth) to get different images in the series.**

## How the circles are placed

There are two nested loops: one that decides **which rings** exist, and one that places **points along each ring**.

**Outer loop (rings):** The loop variable steps in a non‑linear way (`i` goes 1, 2, 4, 7, 11, …). That gives you a limited number of rings, and the “distance” of each from the centre grows in a deliberate pattern rather than linearly—so the composition doesn’t end up too regular or too dense.

```ts
for (let i = 1; i < num; i += i / 2 + 1) {
  // each iteration = one ring; i steps 1, 2, 4, 7, 11, …
}
```

**Inner loop (points on each ring):** For each ring, the code walks around a full circle (0 to 2π) and drops a circle at each step. The **step size** comes from Perlin noise (`noise(i)`, and `noise(j)` for the y‑axis in the position maths). So:

- The **number** of circles per ring varies (noise modulates the step).
- The **radius** of each point is scaled by `i` and noise, so the ring isn’t a perfect circle—it can bulge or pinch.
- **x** and **y** use noise in slightly different ways, so you get something organic and nebula‑like instead of a rigid grid.

```ts
for (let j = 0; j < 2 * p5.PI; j += p5.PI / (p5.noise(i) * 36)) {
  const x = p5.cos(j) * p5.noise(i) * i * width * ratio1 * ratio2
  const y = p5.sin(j) * p5.noise(j) * i * width * ratio1 * ratio2
  const d = ((p5.randomGaussian(0) * width) / scale) * ratio1
  circles.push({ x, y, d })
}
```

So: **same seeds ⇒ same rings, same positions.** The “growth” in the series is just from changing **scale** (circle size/density) and **hue** (background warmth)—the circles don’t move.

## Colour and transparency

Each ring gets one colour. The hue is random (0–360°), saturation and brightness at 100% in HSB. **Alpha** (transparency) comes from a Gaussian (mean 0.4, std dev 0.25), so most circles are partly transparent and a few are more opaque or fainter. That gives depth and overlap without everything turning into a solid block of colour.

```ts
p5.colorMode("hsb", 360, 100, 100, 1)
// one colour per ring: random hue, full sat/bright, Gaussian alpha
const color = p5.color(
  p5.random() * 360,
  100,
  100,
  p5.randomGaussian(0.4, 0.25)
)
```

The background warmth is a single hue passed in and applied as a solid fill before drawing the circles:

```ts
backgroundColor = p5.color(hue, 100, 100, 1)
p5.background(backgroundColor)
```

Once the background and the array of shapes are ready, drawing is a matter of centring the origin and looping over each ring’s circles:

```ts
p5.translate(width / 2, height / 2)
for (let i = 0; i < shapes.length; i++) {
  const group = shapes[i]
  p5.fill(group.color)
  for (let j = 0; j < group.circles.length; j++) {
    const circle = group.circles[j]
    p5.circle(circle.x, circle.y, circle.d)
  }
}
```

Because the background is a single hue and the circles sit on top with varying transparency, **cranking the background warmer (higher hue) makes the whole piece feel warmer**; dial it down and it cools off. The circles keep their random hues, but the background drives the overall mood.

## How it developed

A few choices that stuck:

- **Reproducibility:** Two seeds (one for `random`, one for `noise`) lock in the whole layout. So “Nebula #7” can be recreated exactly—you only need to store or vary **scale**, **hue**, and optionally canvas size.

```ts
p5.draw = () => {
  p5.randomSeed(randomSeed)
  p5.noiseSeed(noiseSeed)
  drawSketch()
}
```

- **Sparse ring sequence:** The non‑linear stepping of `i` controls how many rings you get and how they spread. That avoids either a single dense blob or an overly regular target.
- **Noise for shape:** Perlin noise on step size and radius/position gives smooth, natural variation—small changes don’t cause wild jumps, so the composition stays coherent.
- **Scale and hue as the main controls:** Once you like a seed, you can grow or shrink the circles (scale) and shift the mood (hue) to get a coherent series—e.g. Nebula 1, 2, 3 getting warmer and warmer, or larger and larger.

So in short: **the Nebula series is a deterministic constellation of circles in fixed positions; scale controls size and density, and a single background hue sets the emotional temperature.** No animation, no moving parts—just one frozen moment per set of parameters.

The series was a commission from a dear friend, Alessandro, for his new living room. The space was quite dark and needed saturated colour to give it life—so the warm, bold palette and the idea of a series that could grow in intensity came from that. For me it was actually an amazing experience: it forced me to complete a piece from inception all the way through to print, framing, and delivery. I’d never taken a generative work that far in one go before.
