import { IPoint } from "@/store/slices/image/types"

const defaultPointValue: IPoint = { x: -1, y: -1 }
const maxApproximate = 0.95
const narrowLineTreshold = 2

export function calculateAntiAliasing(
  pixels: number[],
  canvasLength: number,
  points: IPoint[],
  lineColor: number[],
  lineWidth: number,
  lineOpacity: number
) {
  const lineContainsPixel = (point: IPoint): boolean => {
    const yTdiff: number = point.y - (aT * point.x + bT)
    const yBdiff: number = point.y - (aB * point.x + bB)
    const yLdiff: number = point.y - (aL * point.x + bL)
    const yRdiff: number = point.y - (aR * point.x + bR)
    return yTdiff >= 0 && yLdiff <= 0 && yRdiff >= 0 && yBdiff <= 0
  }

  const calcTrapezoidArea = (
    base1: number,
    base2: number,
    h: number
  ): number => {
    return Math.min(
      ((Math.abs(base1) + Math.abs(base2)) * h) / 2,
      maxApproximate
    )
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

    const LTin: boolean = lineContainsPixel(pixLT)
    const RTin: boolean = lineContainsPixel(pixRT)
    const LBin: boolean = lineContainsPixel(pixLB)
    const RBin: boolean = lineContainsPixel(pixRB)

    let x1: number, y1: number, x2: number, y2: number, x3: number, y3: number

    // 4 booleans are true
    if (LTin && RTin && LBin && RBin) return 1

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
      y2 = aR * x2 + bR
      x3 = pixRT.x
      y3 = pixRT.y
      return 1 - calcTriangleArea(x1, y1, x2, y2, x3, y3)
    }

    if (LTin && RTin && LBin && !RBin) {
      x1 = (pixelB - bB) / aB
      y1 = pixelB
      x2 = pixelR
      y2 = aB * x2 + bB
      x3 = pixRB.x
      y3 = pixRB.y
      return 1 - calcTriangleArea(x1, y1, x2, y2, x3, y3)
    }

    if (LTin && RTin && !LBin && RBin) {
      x1 = (pixelB - bL) / aL
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
      return calcTrapezoidArea(y1 - pixLT.y, y2 - pixRT.y, 1)
    }

    if (!LTin && RTin && !LBin && RBin) {
      if (pixLT.y >= lt.y) {
        x1 = (pixelT - bL) / aL
        x2 = (pixelB - bL) / aL
      } else {
        x1 = (pixelT - bT) / aT
        x2 = (pixelB - bT) / aT
      }
      return calcTrapezoidArea(pixRT.x - x1, pixRB.x - x2, 1)
    }

    if (!LTin && !RTin && LBin && RBin) {
      if (pixRT.x <= rt.x) {
        y1 = aT * pixelL + bT
        y2 = aT * pixelR + bT
      } else {
        y1 = aR * pixelL + bR
        y2 = aR * pixelR + bR
      }
      return calcTrapezoidArea(pixLB.y - y1, pixRB.y - y2, 1)
    }

    if (LTin && !RTin && LBin && !RBin) {
      if (pixRB.y <= rb.y) {
        x1 = (pixelT - bR) / aR
        x2 = (pixelB - bR) / aR
      } else {
        x1 = (pixelT - bB) / aB
        x2 = (pixelB - bB) / aB
      }
      return calcTrapezoidArea(x1 - pixLT.x, x2 - pixLB.x, 1)
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
      const firstArea = calcTriangleArea(xL, yL, xB, yB, pixLB.x, pixLB.y)
      xR = pixelR
      yR = aR * xR + bR
      xT = (pixelT - bR) / aR
      yT = pixelT
      const secondArea = calcTriangleArea(xR, yR, xT, yT, pixRT.x, pixRT.y)
      return 1 - firstArea - secondArea
    }

    if (!LTin && RTin && LBin && !RBin) {
      xL = pixelL
      yL = aL * xL + bT
      xB = (pixelT - bT) / aT
      yB = pixelT
      const firstArea = calcTriangleArea(xL, yL, xB, yB, pixLT.x, pixLT.y)
      xR = pixelR
      yR = aB * xR + bB
      xB = (pixelB - bB) / aB
      yB = pixelB
      const secondArea = calcTriangleArea(xR, yR, xB, yB, pixRB.x, pixRB.y)
      return 1 - firstArea - secondArea
    }

    // 1 boolean is true
    let best1x: number,
      best2x: number,
      best1y: number,
      best2y: number,
      x4: number,
      y4: number,
      x5: number,
      y5: number

    if (LTin && !RTin && !LBin && !RBin) {
      x1 = (pixelT - bR) / aR
      y1 = pixelT
      x2 = (pixelT - bB) / aB
      y2 = pixelT
      best1x = x1 < x2 ? x1 : x2
      best1y = best1x === x1 ? y1 : y2
      x3 = pixelL
      y3 = aL * x3 + bL
      x4 = pixelL
      y4 = aB * x4 + bB
      best2y = y3 < y4 ? y3 : y4
      best2x = best2y === y3 ? x3 : x4
      x5 = pixLT.x
      y5 = pixLT.y
      return calcTriangleArea(best1x, best1y, best2x, best2y, x5, y5)
    }

    if (!LTin && RTin && !LBin && !RBin) {
      x1 = (pixelT - bT) / aT
      y1 = pixelT
      x2 = (pixelT - bL) / aL
      y2 = pixelT
      best1x = x1 > x2 ? x1 : x2
      best1y = best1x === x1 ? y1 : y2
      x3 = pixelR
      y3 = aL * x3 + bL
      x4 = pixelR
      y4 = aB * x4 + bB
      best2y = y3 < y4 ? y3 : y4
      best2x = best2y === y3 ? x3 : x4
      x5 = pixRT.x
      y5 = pixRT.y
      return calcTriangleArea(best1x, best1y, best2x, best2y, x5, y5)
    }

    if (!LTin && !RTin && !LBin && RBin) {
      x1 = (pixelB - bT) / aT
      y1 = pixelB
      x2 = (pixelB - bL) / aL
      y2 = pixelB
      best1x = x1 > x2 ? x1 : x2
      best1y = best1x === x1 ? y1 : y2
      x3 = pixelR
      y3 = aT * x3 + bT
      x4 = pixelR
      y4 = aR * x4 + bR
      best2y = y3 > y4 ? y3 : y4
      best2x = best2y === y3 ? x3 : x4
      x5 = pixRB.x
      y5 = pixRB.y
      return calcTriangleArea(best1x, best1y, best2x, best2y, x5, y5)
    }

    if (!LTin && !RTin && LBin && !RBin) {
      x1 = (pixelB - bR) / aR
      y1 = pixelB
      x2 = (pixelB - bB) / aB
      y2 = pixelB
      best1x = x1 < x2 ? x1 : x2
      best1y = best1x === x1 ? y1 : y2
      x3 = pixelL
      y3 = aT * x3 + bT
      x4 = pixelL
      y4 = aR * x4 + bR
      best2y = y3 > y4 ? y3 : y4
      best2x = best2y === y3 ? x3 : x4
      x5 = pixLB.x
      y5 = pixLB.y
      return calcTriangleArea(best1x, best1y, best2x, best2y, x5, y5)
    }

    return 0
  }

  const countWuPercentageLongX = (pixel: IPoint) => {
    const lineCenter: IPoint = {
      x: pixel.x,
      y: aM * pixel.x + bM,
    }
    if (
      !(
        lineContainsPixel(lineCenter) && Math.abs(lineCenter.y - pixel.y) <= 0.5
      )
    )
      return [0, 0, 0]

    const belowY = pixel.y + 0.5
    const aboveY = pixel.y - 0.5
    const percentageBelow = Math.max(0, lineCenter.y + lineWidth / 2 - belowY)
    const percentageAbove = Math.max(0, aboveY - (lineCenter.y - lineWidth / 2))
    const percentageMid =
      Math.min(lineWidth / 2, belowY - lineCenter.y) +
      Math.min(lineWidth / 2, lineCenter.y - aboveY)
    return [percentageAbove, percentageMid, percentageBelow]
  }

  const countWuPercentageLongY = (pixel: IPoint) => {
    const lineCenter: IPoint = {
      x: (pixel.y - bM) / aM,
      y: pixel.y,
    }
    if (
      !(
        lineContainsPixel(lineCenter) && Math.abs(lineCenter.x - pixel.x) <= 0.5
      )
    )
      return [0, 0, 0]

    const leftX = pixel.x - 0.5
    const rightX = pixel.x + 0.5
    const percentageRight = Math.max(0, lineCenter.x + lineWidth / 2 - rightX)
    const percentageLeft = Math.max(0, leftX - (lineCenter.x - lineWidth / 2))
    const percentageMid =
      Math.min(lineWidth / 2, rightX - lineCenter.x) +
      Math.min(lineWidth / 2, lineCenter.x - leftX)
    return [percentageLeft, percentageMid, percentageRight]
  }

  const dist = lineWidth / 2
  const start = points[0].x < points[1].x ? points[0] : points[1]
  const end = points[0].x > points[1].x ? points[0] : points[1]
  const d: IPoint = { ...defaultPointValue }
  let cosAlpha: number
  let sinAlpha: number
  if (start.y !== end.y) {
    const len = Math.sqrt(
      (end.x - start.x) * (end.x - start.x) +
        (end.y - start.y) * (end.y - start.y)
    )
    cosAlpha = Math.abs(end.y - start.y) / len
    sinAlpha = (end.x - start.x) / len

    d.y = dist * sinAlpha
    d.x = dist * cosAlpha
  } else {
    d.y = dist
    d.x = 0
  }

  // line rectangle points
  const lt: IPoint = { ...defaultPointValue }
  const rt: IPoint = { ...defaultPointValue }
  const lb: IPoint = { ...defaultPointValue }
  const rb: IPoint = { ...defaultPointValue }
  let aT: number, bT: number
  let aB: number, bB: number
  let aL: number, bL: number
  let aR: number, bR: number
  let aM: number, bM: number

  const calcFunctions = (x1: IPoint, x2: IPoint): number[] => {
    const a: number = (x1.y - x2.y) / (x1.x - x2.x)
    const b: number = (x1.x * x2.y - x2.x * x1.y) / (x1.x - x2.x)
    return [a, b]
  }

  const calcCoeffs = () => {
    const aTbT: number[] = calcFunctions(rt, lt)
    aT = aTbT[0]
    bT = aTbT[1]
    const aBbB: number[] = calcFunctions(rb, lb)
    aB = aBbB[0]
    bB = aBbB[1]
    const aLbL: number[] = calcFunctions(lt, lb)
    aL = aLbL[0]
    bL = aLbL[1]
    const aRbR: number[] = calcFunctions(rt, rb)
    aR = aRbR[0]
    bR = aRbR[1]
    const aMbM: number[] = calcFunctions(start, end)
    aM = aMbM[0]
    bM = aMbM[1]
  }

  if (start.x === end.x) {
    end.x += 1
  }

  if (start.y < end.y) {
    lt.x = start.x - d.x
    lt.y = start.y + d.y

    rt.x = start.x + d.x
    rt.y = start.y - d.y

    lb.x = end.x - d.x
    lb.y = end.y + d.y

    rb.x = end.x + d.x
    rb.y = end.y - d.y
  }

  if (start.y > end.y) {
    lt.x = start.x - d.x
    lt.y = start.y - d.y

    rt.x = end.x - d.x
    rt.y = end.y - d.y

    lb.x = start.x + d.x
    lb.y = start.y + d.y

    rb.x = end.x + d.x
    rb.y = end.y + d.y
  }

  calcCoeffs()

  const calcPixelPosition = (pixelId: number) => {
    return {
      x: pixelId % canvasLength,
      y: Math.ceil(pixelId / canvasLength),
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

  if (lineWidth > narrowLineTreshold) {
    for (let i = 0; i < pixels.length; i += 3) {
      const point = calcPixelPosition(i / 3)
      const share = countPercentageBasic(point)
      for (let j = 0; j < 3; j += 1) {
        newPixels[i + j] = mixColor(pixels[i + j], lineColor[j], share)
      }
    }
  } else {
    if (Math.abs(end.x - start.x) > Math.abs(end.y - start.y)) {
      for (let i = 0; i < pixels.length; i += 3) {
        const point = calcPixelPosition(i / 3)
        const share = countWuPercentageLongX(point)
        if (share[1] !== 0) {
          for (let j = 0; j < 3; j += 1) {
            if (i - canvasLength * 3 + j >= 0) {
              newPixels[i - canvasLength * 3 + j] = mixColor(
                pixels[i - canvasLength * 3 + j],
                lineColor[j],
                share[0]
              )
            }
            newPixels[i + j] = mixColor(pixels[i + j], lineColor[j], share[1])
            if (i + canvasLength * 3 + j < pixels.length) {
              newPixels[i + canvasLength * 3 + j] = mixColor(
                pixels[i + canvasLength * 3 + j],
                lineColor[j],
                share[2]
              )
            }
          }
        }
      }
    } else {
      for (let i = 0; i < pixels.length; i += 3) {
        const point = calcPixelPosition(i / 3)
        const share = countWuPercentageLongY(point)
        if (share[1] !== 0) {
          for (let j = 0; j < 3; j += 1) {
            if (i - 3 + j >= 0) {
              newPixels[i - 3 + j] = mixColor(
                pixels[i - 3 + j],
                lineColor[j],
                share[0]
              )
            }
            newPixels[i + j] = mixColor(pixels[i + j], lineColor[j], share[1])
            if (i + 3 + j < pixels.length) {
              newPixels[i + 3 + j] = mixColor(
                pixels[i + 3 + j],
                lineColor[j],
                share[2]
              )
            }
          }
        }
      }
    }
  }

  return newPixels
}
