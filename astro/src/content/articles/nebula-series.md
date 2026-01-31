---
title: The Nebula series — how it’s made
description: "How the Nebula generative series works: circles in fixed positions, growing in size, against a background that shifts in warmth."
pubDate: 2025-01-31
---

The Nebula series is a generative artwork built around a simple idea: **a set of circles is generated once and kept in the same positions; their apparent size and density are controlled by a scale parameter, while the mood of the image is set by a single background hue that shifts from cool to warm.** Each run is deterministic—same seeds always give the same layout—so you can refine a composition by changing only a few knobs.

## The core idea

The image is made of many small circles. They are not placed at random. They are arranged in **concentric rings** that spread outward from the centre. Each ring has:

- Its own **colour** (a random hue at full saturation and brightness),
- Its own **transparency** (from a Gaussian distribution so most circles are semi‑transparent, with natural variation),
- A **fixed set of positions** determined by two seeds (random and noise), so the same seeds always produce the same “constellation”.

The **background** is a single, solid hue (e.g. a warm orange or a cool blue). That hue is the main parameter that makes the piece feel warmer or cooler; the circles sit on top of it and blend via transparency.

So in practice: **circles generated once, same positions every time; you change scale (size/density) and hue (warmth of the background) to get different images in the series.**

## How the circles are placed

The program uses two nested structures: an outer loop that defines **which rings** exist, and an inner loop that places **points along each ring**.

**Outer loop (rings):** The loop variable steps in a non‑linear way (e.g. `i` goes 1, 2, 4, 7, 11, …). So you get a limited number of rings, and the “distance” of each ring from the centre grows in a deliberate pattern rather than linearly. That keeps the composition from being too regular or too dense.

```ts
for (let i = 1; i < num; i += i / 2 + 1) {
  // each iteration = one ring; i steps 1, 2, 4, 7, 11, …
}
```

**Inner loop (points on each ring):** For each ring, the code walks around a full circle (0 to 2π) and places one circle at each step. The **step size** is driven by Perlin noise: `noise(i)` (and in the position maths, `noise(j)` for the y‑axis). So:

- The **number** of circles per ring varies from ring to ring (noise modulates the step).
- The **radius** of each point is scaled by `i` and by noise, so the ring isn’t a perfect circle—it can bulge or pinch.
- The **x** and **y** coordinates use noise in slightly different ways, so you get an organic, nebula‑like shape rather than a rigid grid or a perfect circle.

```ts
for (let j = 0; j < 2 * p5.PI; j += p5.PI / (p5.noise(i) * 36)) {
  const x = p5.cos(j) * p5.noise(i) * i * width * ratio1 * ratio2
  const y = p5.sin(j) * p5.noise(j) * i * width * ratio1 * ratio2
  const d = ((p5.randomGaussian(0) * width) / scale) * ratio1
  circles.push({ x, y, d })
}
```

So: **same seeds ⇒ same rings, same positions.** The “growth” in the series comes from changing **scale** (circle diameter and density) and **hue** (background warmth), not from moving the circles.

## Colour and transparency

Each ring is assigned one colour. The hue is random (0–360°), with saturation and brightness fixed at 100% in HSB. The **alpha** (transparency) is drawn from a Gaussian distribution (e.g. mean 0.4, standard deviation 0.25). So most circles are partly transparent; some are more opaque, some more faint. That gives depth and overlap without the image turning into a solid block of colour.

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

Because the background is a single hue and the circles sit on top with varying transparency, **increasing the warmth of the background (higher hue value) makes the whole piece feel warmer**; lowering it makes it cooler. The circles themselves keep their random hues, but the overall mood is dominated by that background.

## How it developed

The design leans on a few deliberate choices:

- **Reproducibility:** Two seeds (one for `random`, one for `noise`) fix the entire layout. So “Nebula #7” can be exactly recreated and only the **scale** and **hue** (and optionally canvas size) need to be stored or varied.

```ts
p5.draw = () => {
  p5.randomSeed(randomSeed)
  p5.noiseSeed(noiseSeed)
  drawSketch()
}
```

- **Sparse ring sequence:** The non‑linear stepping of `i` controls how many rings there are and how they spread. That avoids either a single dense blob or an overly regular target pattern.
- **Noise for shape:** Using Perlin noise for step size and for radius/position gives smooth, natural variation. Small changes in the noise inputs don’t cause wild jumps—so the composition feels coherent.
- **Scale and hue as the main controls:** Once you’re happy with a seed, you can grow or shrink the circles (scale) and shift the mood (hue) to produce a coherent series (e.g. “Nebula 1, 2, 3” as warmer and warmer, or larger and larger).

So in short: **the Nebula series is a deterministic constellation of circles in fixed positions, with size and density controlled by scale and emotional temperature by a single background hue.** The logic is all in how those rings and positions are generated and how colour and transparency are applied—no animation, no moving parts, just one frozen moment per set of parameters.
