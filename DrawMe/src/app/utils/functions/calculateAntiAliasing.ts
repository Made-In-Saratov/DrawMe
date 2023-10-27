import { IPoint } from "@/store/slices/image/types"

const defaultPointValue: IPoint = { x: -1, y: -1 }

export function calculateAntiAliasing(
  pixels: number[],
  canvasLength: number,
  points: IPoint[],
  lineColor: number[],
  lineWidth: number,
  lineOpacity: number
): number[] {
  const contains = (point: IPoint): boolean => {
    const yTdiff: number = point.y - (aT * point.x + bT)
    const yBdiff: number = point.y - (aB * point.x + bB)
    const yLdiff: number = point.y - (aL * point.x + bL)
    const yRdiff: number = point.y - (aR * point.x + bR)
    return yTdiff >= 0 && yLdiff <= 0 && yRdiff >= 0 && yBdiff <= 0
  }

  const calcTriangleArea = (
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    x3: number,
    y3: number
  ): number => {
    return Math.abs((x2 - x1) * (y3 - y1) - (x3 - x1) * (y2 - y1)) / 2
  }
  const countPercentageBasic = (pixel: IPoint): number => {
    const pixelT: number = pixel.y - 0.5
    const pixelB: number = pixel.y + 0.5
    const pixelL: number = pixel.x - 0.5
    const pixelR: number = pixel.x + 0.5

    const pixLT: IPoint = {
      x: pixelL,
      y: pixelT,
    }
    const pixRT: IPoint = {
      x: pixelR,
      y: pixelT,
    }
    const pixLB: IPoint = {
      x: pixelL,
      y: pixelB,
    }
    const pixRB: IPoint = {
      x: pixelR,
      y: pixelB,
    }

    const LTin: boolean = contains(pixLT)
    const RTin: boolean = contains(pixRT)
    const LBin: boolean = contains(pixLB)
    const RBin: boolean = contains(pixRB)

    let x1: number, y1: number, x2: number, y2: number, x3: number, y3: number

    // 4 booleans are true

    if (LTin && RTin && LBin && RBin) {
      return 1
    }

    // 3 booleans are true

    if (!LTin && RTin && LBin && RBin) {
      x1 = (pixelT - bT) / aT
      y1 = pixelT
      x2 = pixelL
      y2 = aT * x2 + bT
      x3 = pixLT.x
      y3 = pixLT.y
      return 1 - calcTriangleArea(x1, y1, x2, y2, x3, y3)
    }

    if (LTin && !RTin && LBin && RBin) {
      x1 = (pixelT - bR) / aR
      y1 = pixelT
      x2 = pixelR
      y2 = aR * x2 + bT
      x3 = pixRT.x
      y3 = pixRT.y
      return 1 - calcTriangleArea(x1, y1, x2, y2, x3, y3)
    }

    if (LTin && RTin && LBin && !RBin) {
      x1 = (pixelB - bB) / aB
      y1 = pixelB
      x2 = pixelR
      y2 = aR * x2 + bR
      x3 = pixRB.x
      y3 = pixRB.y
      return 1 - calcTriangleArea(x1, y1, x2, y2, x3, y3)
    }

    if (LTin && RTin && !LBin && RBin) {
      x1 = (pixelL - bL) / aL
      y1 = pixelB
      x2 = pixelL
      y2 = aL * x2 + bL
      x3 = pixLB.x
      y3 = pixLB.y
      return 1 - calcTriangleArea(x1, y1, x2, y2, x3, y3)
    }

    // 2 booleans are true

    if (LTin && RTin && !LBin && !RBin) {
      if (pixRB.x <= lb.x) {
        y1 = aL * pixelL + bL
        y2 = aL * pixelR + bL
      } else {
        y1 = aB * pixelL + bB
        y2 = aB * pixelR + bB
      }
      return ((y1 - pixLT.y) * (y2 - pixRT.y)) / 2
    }

    if (!LTin && RTin && !LBin && RBin) {
      if (pixLT.y >= lt.y) {
        x1 = (pixelT - bL) / aL
        x2 = (pixelB - bL) / aL
      } else {
        x1 = (pixelT - bT) / aT
        x2 = (pixelB - bT) / aT
      }
      return ((pixRT.x - x1) * (pixRB.x - x2)) / 2
    }

    if (!LTin && !RTin && LBin && RBin) {
      if (pixRT.x <= rt.x) {
        y1 = aT * pixelL + bT
        y2 = aT * pixelR + bT
      } else {
        y1 = aR * pixelL + bR
        y2 = aR * pixelR + bR
      }
      return ((pixLB.y - y1) * (pixRB.y - y2)) / 2
    }

    if (LTin && !RTin && LBin && !RBin) {
      if (pixRB.y <= rb.y) {
        x1 = (pixelT - bR) / aR
        x2 = (pixelB - bR) / aR
      } else {
        x1 = (pixelT - bB) / aB
        x2 = (pixelT - bB) / aB
      }
      return ((x1 - pixLT.x) * (x2 - pixLB.x)) / 2
    }

    let xL: number,
      yL: number,
      xB: number,
      yB: number,
      xR: number,
      yR: number,
      xT: number,
      yT: number

    if (LTin && !RTin && !LBin && RBin) {
      xL = pixelL
      yL = aL * xL + bL
      xB = (pixelB - bL) / aL
      yB = pixelB
      const xLB = pixelL
      const yLB = pixelB
      const firstArea = calcTriangleArea(xL, yL, xB, yB, xLB, yLB)
      xR = pixelR
      yR = aR * xR + bR
      xT = (pixelT - bR) / aR
      yT = pixelT
      const xRT = pixelR
      const yRT = pixelT
      const secondArea = calcTriangleArea(xR, yR, xT, yT, xRT, yRT)
      return 1 - firstArea - secondArea
    }

    if (!LTin && RTin && LBin && !RBin) {
      xL = pixelL
      yL = aL * xL + bT
      xB = (pixelB - bT) / aT
      yB = pixelT
      const xLT = pixelL
      const yLT = pixelT
      const firstArea = calcTriangleArea(xL, yL, xB, yB, xLT, yLT)
      xR = pixelR
      yR = aB * xR + bB
      xB = (pixelB - bB) / aB
      yB = pixelB
      const xRB = pixelR
      const yRB = pixelB
      const secondArea = calcTriangleArea(xR, yR, xB, yB, xRB, yRB)
      return 1 - firstArea - secondArea
    }

    // 1 boolean is true

    let xC: number, x4: number, y4: number, x5: number, y5: number

    if (LTin && !RTin && !LBin && !RBin) {
      xC = (pixelB - bL) / aL
      if (xC <= rb.x) {
        x1 = pixelL
        y1 = aL * pixelL + bL
        x2 = lb.x
        y2 = lb.y
        x3 = (pixelB - bL) / aL
        y3 = pixelB
        const firstArea = calcTriangleArea(x1, y1, x2, y2, x3, y3)
        x4 = (pixelB - bR) / aR
        y4 = pixelB
        x5 = (pixelT - bR) / aR
        y5 = pixelT
        return 1 - firstArea - ((rb.x - x4) * (rt.x - x5)) / 2
      } else {
        x1 = (pixelT - bR) / aR
        y1 = pixelT
        x2 = rt.x
        y2 = rt.y
        x3 = pixelR
        y3 = aR * x3 + bR
        const firstArea = calcTriangleArea(x1, y1, x2, y3, x3, y3)
        x4 = pixelR
        y4 = aL * x4 + bL
        x5 = pixelL
        y5 = aL * x5 + bL
        return 1 - firstArea - ((rb.y - y4) * (lb.y - y5)) / 2
      }
    }

    if (!LTin && RTin && !LBin && !RBin) {
      xC = (pixelB - bL) / aL
      if (xC < lb.x) {
        x1 = pixelL
        y1 = aT * pixelL + bT
        x2 = lt.x
        y2 = lt.y
        x3 = (pixelT - bT) / aT
        y3 = pixelT
        const firstArea = calcTriangleArea(x1, y1, x2, y2, x3, y3)
        x4 = pixelR
        y4 = aB * x4 + bB
        x5 = pixelL
        y5 = aB * x5 + bB
        return 1 - firstArea - ((lb.y - y5) * (rb.y - y4)) / 2
      } else {
        x1 = pixelR
        y1 = aB * pixelL + bB
        x2 = (pixelB - bB) / aB
        y2 = pixelB
        x3 = rb.x
        y3 = rb.y
        const firstArea = calcTriangleArea(x1, y1, x2, y2, x3, y3)
        x4 = (pixelB - bT) / aT
        y4 = pixelB
        x5 = (pixelT - bT) / aT
        y5 = pixelT
        return 1 - firstArea - ((x5 - lt.x) * (x4 - lb.x)) / 2
      }
    }

    if (!LTin && !RTin && !LBin && RBin) {
      xC = (pixelT - bR) / aR
      if (xC >= lt.x) {
        x1 = (pixelT - bR) / aR
        y1 = pixelT
        x2 = pixelR
        y2 = aR * x2 + bR
        x3 = rt.x
        y3 = rt.y
        const firstArea = calcTriangleArea(x1, y1, x2, y2, x3, y3)
        x4 = (pixelB - bL) / aL
        y4 = pixelB
        x5 = (pixelT - bL) / aL
        y5 = pixelT
        return 1 - firstArea - ((x5 - lt.x) * (x4 - lb.x)) / 2
      } else {
        x1 = (pixelB - bL) / aL
        y1 = pixelB
        x2 = pixelL
        y2 = aL * x2 + bL
        x3 = lb.x
        y3 = lb.y
        const firstArea = calcTriangleArea(x1, y1, x2, y2, x3, y3)
        x4 = pixelL
        y4 = aR * x4 + bR
        x5 = pixelR
        y5 = aR * x5 + bR
        return 1 - firstArea - ((y5 - lt.y) * (y4 - rt.y)) / 2
      }
    }

    if (!LTin && !RTin && LBin && !RBin) {
      xC = (pixelT - bT) / aT
      if (xC > rt.x) {
        x1 = pixelR
        y1 = aB * x1 + bB
        x2 = rb.x
        y2 = rb.y
        x3 = (pixelB - bB) / aB
        y3 = pixelB
        const firstArea = calcTriangleArea(x1, y1, x2, y2, x3, y3)
        x4 = pixelL
        y4 = aT * x4 + bT
        x5 = pixelR
        y5 = aT * x5 + bT
        return 1 - firstArea - ((y5 - rt.y) * (y4 - lt.y)) / 2
      } else {
        x1 = pixelL
        y1 = aT * x1 + bT
        x2 = (pixelT - bT) / aT
        y2 = pixelT
        x3 = lt.x
        y3 = lt.y
        const firstArea = calcTriangleArea(x1, y1, x2, y2, x3, y3)
        x4 = (pixelT - bB) / aB
        y4 = pixelT
        x5 = (pixelB - bB) / aB
        y5 = pixelB
        return 1 - firstArea - ((rt.x - x4) * (rb.x - x5)) / 2
      }
    }

    // 0 booleans are true

    x1 = (pixelT - bL) / aL // TODO
    x2 = (pixelT - bR) / aR
    x3 = (pixelT - bT) / aT
    x4 = (pixelT - bB) / aB

    if (pixelL <= x1 && x2 <= pixelR) {
      return x2 - x1
    }

    if (pixelL <= x3 && x4 <= pixelR) {
      return x4 - x3
    }

    return 0
  }

  const containsAlongAxis = (point: IPoint): boolean => {
    return (
      point.x >= lt.x && point.x <= rt.x && point.y >= lt.y && point.y <= lb.y
    )
  }

  const countPercentageAlongAxis = (pixel: IPoint): number => {
    const pixelT: number = pixel.y - 0.5
    const pixelB: number = pixel.y + 0.5
    const pixelL: number = pixel.x - 0.5
    const pixelR: number = pixel.x + 0.5

    const pixLT: IPoint = {
      x: pixelL,
      y: pixelT,
    }
    const pixRT: IPoint = {
      x: pixelR,
      y: pixelT,
    }
    const pixLB: IPoint = {
      x: pixelL,
      y: pixelB,
    }
    const pixRB: IPoint = {
      x: pixelR,
      y: pixelB,
    }

    const LTin: boolean = containsAlongAxis(pixLT)
    const RTin: boolean = containsAlongAxis(pixRT)
    const LBin: boolean = containsAlongAxis(pixLB)
    const RBin: boolean = containsAlongAxis(pixRB)

    let k: number

    // 4 booleans are true

    if (LTin && RTin && LBin && RBin) {
      return 1
    }

    // 2 booleans are true

    if (LTin && RTin && !LBin && !RBin) {
      if (start.x === end.x) {
        return 0.5
      }
      if (start.y === end.y) {
        k = dist - 0.5
        return k - Math.floor(k)
      }
    }
    if (LTin && !RTin && LBin && !RBin) {
      if (start.x === end.x) {
        k = dist - 0.5
        return k - Math.floor(k)
      }
      if (start.y === end.y) {
        return 0.5
      }
    }
    if (!LTin && RTin && !LBin && RBin) {
      if (start.x === end.x) {
        k = dist - 0.5
        return k - Math.floor(k)
      }
      if (start.y === end.y) {
        return 0.5
      }
    }

    // 1 boolean is true

    if (Number(LTin) + Number(RTin) + Number(LBin) + Number(RBin) === 1) {
      k = dist - 0.5
      return (k - Math.floor(k)) * 0.5
    }

    // 0 booleans are true

    if (start.x === end.x) {
      if (pixelL <= lt.x) {
        return dist * 2
      } else {
        return 0
      }
    }

    if (start.y === end.y) {
      if (pixelT <= lt.y) {
        return dist * 2
      } else {
        return 0
      }
    }

    return 0
  }

  const dist = lineWidth / 2
  const start = points[0].x < points[1].x ? points[0] : points[1]
  const end = points[0].x > points[1].x ? points[0] : points[1]
  const d: IPoint = defaultPointValue
  let tanAlpha: number
  let sinAlpha: number
  if (start.y !== end.y) {
    tanAlpha = (end.x - start.x) / Math.abs(end.y - start.y)
    sinAlpha =
      (end.x - start.x) /
      Math.sqrt(
        (end.x - start.x) * (end.x - start.x) +
          (end.y - start.y) * (end.y - start.y)
      )
    d.y = dist * sinAlpha
    d.x = (dist * tanAlpha) / sinAlpha
  } else {
    d.y = dist
    d.x = 0
  }

  // line rectangle points
  const lt: IPoint = defaultPointValue
  const rt: IPoint = defaultPointValue
  const lb: IPoint = defaultPointValue
  const rb: IPoint = defaultPointValue
  let aT: number, bT: number
  let aB: number, bB: number
  let aL: number, bL: number
  let aR: number, bR: number

  // flag for defining case
  let isFirstCase: boolean = true

  const calcFunctions = (r: IPoint, l: IPoint): number[] => {
    const a: number = (r.y - l.y) / (r.x - l.x)
    const b: number = r.x * r.y - l.x * r.y
    return [a, b]
  }

  const calcCoeffs = () => {
    ;[aT, bT] = calcFunctions(rt, lt)
    ;[aB, bB] = calcFunctions(rb, lb)
    ;[aL, bL] = calcFunctions(lt, lb)
    ;[aR, bR] = calcFunctions(rt, rb)
  }

  // first case
  if (start.x === start.y) {
    lt.x = start.x - d.x
    lt.y = start.y

    rt.x = start.x + d.x
    rt.y = start.y

    lb.x = end.x - d.x
    lb.y = end.y

    rb.x = end.x + d.x
    rb.y = end.y
  }

  if (end.x === end.y) {
    lt.x = start.x
    lt.y = start.y - d.y

    rt.x = start.x
    rt.y = start.y - d.y

    lb.x = end.x
    lb.y = end.y + d.y

    rb.x = end.x
    rb.y = end.y + d.y
  }

  // second case
  if (start.y < end.y) {
    lt.x = start.x - d.x
    lt.y = start.y + d.y

    rt.x = start.x + d.x
    rt.y = start.y - d.y

    lb.x = end.x - d.x
    lb.y = end.y + d.y

    rb.x = end.x + d.x
    rb.y = end.y - d.y

    calcCoeffs()

    isFirstCase = false
  }

  // third case
  if (start.y > end.y) {
    lt.x = start.x - d.x
    lt.y = start.y - d.y

    rt.x = end.x - d.x
    rt.y = end.y - d.y

    lb.x = start.x + d.x
    lb.y = start.y + d.y

    rb.x = end.x + d.x
    rb.y = end.y + d.y

    calcCoeffs()

    isFirstCase = false
  }

  const calcPixelPosition = (pixelId: number) => {
    return {
      x: pixelId / canvasLength,
      y: pixelId % canvasLength,
    }
  }

  const mixColor = (
    backgroundColor: number,
    lineColor: number,
    share: number
  ): number => {
    return Math.round(
      backgroundColor * (1 - lineOpacity * share) +
        lineColor * lineOpacity * share
    )
  }

  const newPixels = [...pixels]

  for (let i = 0; i < pixels.length; i += 3) {
    const point = calcPixelPosition(i)
    const share = isFirstCase
      ? countPercentageAlongAxis(point)
      : countPercentageBasic(point)
    for (let j = 0; j < 3; j += 1) {
      newPixels[j] = mixColor(pixels[j], lineColor[j], share)
    }
  }

  return newPixels
}
