---
title: How to calculate pixels for any print size at 300 DPI
description: Pick your print size first, then work out the pixel dimensions you need at 300 DPI so the print stays sharp.
pubDate: 2026-08-05
---

Ok, you’ve got your artwork algorithm working. Now you want to generate an image that can actually print sharp at 300 DPI for a specific paper size.

That’s the right way round. Instead of making a small file and hoping it scales, decide the print size first, then generate enough pixels for it.

## Start with the print size

First, decide how big you want the print to be — A4, A3, A2, or a custom size.

Once you know the final paper size, the pixel question becomes simple maths.

## What 300 DPI means

300 DPI just means 300 pixels for every inch of paper.

So if your print is 10 inches wide, you need 10 × 300 = 3000 pixels across. Same idea for the height. That’s the usual target for a sharp art print.

## The formula

Multiply the print width and height in inches by 300.

```
pixels = inches × 300
```

If your size is in millimetres, convert to inches first (divide by 25.4), then multiply by 300.

## Common sizes at 300 DPI

Here are the pixel sizes I use most often for standard paper:

- **A4** (210 × 297 mm) → about **2480 × 3508 px**
- **A3** (297 × 420 mm) → about **3508 × 4961 px**
- **A2** (420 × 594 mm) → about **4961 × 7016 px**

Generate or export at those dimensions and you’re print-ready at 300 DPI.

## Already have a file?

If the image already exists, divide its pixel width and height by 300.

That gives you the largest size, in inches, where the print should still look sharp. If you need something bigger, regenerate at a higher resolution rather than stretching the file.

## Takeaway

Pick the print size first, then generate enough pixels to hit 300 DPI. That’s the cleanest way to keep digital work looking crisp on paper.
