import { IPoint } from "@/store/slices/image/types"

const defaultPointValue: IPoint = { x: -1, y: -1 }
const maxApproximate: number = 0.95

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

  const calcDistance = (
    x1: number,
    y1: number,
    x2: number,
    y2: number
  ): number => {
    return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1))
  }
  const calcTrapezoidArea = (
    base1: number,
    base2: number,
    h: number
  ): number => {
    return Math.min((Math.abs(base1) + Math.abs(base2)) * h / 2, maxApproximate)
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
    if (!(LTin && RTin && LBin && RBin || !LTin && !RTin && !LBin && !RBin)) console.log(`cX: ${pixel.x}, cY: ${pixel.y}, LTin: ${LTin}, RTin: ${RTin}, RBin: ${RBin}, LBin: ${LBin}`)

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

    let xC: number, xK: number, best1x: number, best2x: number, best1y: number, best2y: number, x4: number, y4: number, x5: number, y5: number

    if (LTin && !RTin && !LBin && !RBin) {
      // if (lt.x < pixelR && rt.y < pixelB) {  // for narrow lines
      //   x1 = (pixelT - bR) / aR
      //   y1 = pixelT
      //   x2 = pixelR
      //   y2 = aR * x2 + bR
      //   x3 = pixelR
      //   y3 = aL * x3 + bL
      //   x4 = pixelL
      //   y4 = aL * x4 + bL
      //   return calcTrapezoidArea(calcDistance(x1, y1, x2, y2), calcDistance(x3, y3, x4, y4), Math.abs(bR - bL))
      // }
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
      console.log(`p1: ${best1x},${best1y} | p2: ${best2x},${best2y} | p3: ${x5},${y5}`)
      return calcTriangleArea(best1x, best1y, best2x, best2y, x5, y5)
    }

    if (!LTin && RTin && !LBin && !RBin) {
      // if (lb.x < pixelR && lt.y > pixelT) {  // for narrow lines
      //   x1 = pixelL
      //   y1 = aT * x1 + bT
      //   x2 = (pixelT - bT) / aT
      //   y2 = pixelT
      //   x3 = pixelR
      //   y3 = aB * x3 + bB
      //   x4 = (pixelB - bB) / aB
      //   y4 = pixelB
      //   return calcTrapezoidArea(calcDistance(x1, y1, x2, y2), calcDistance(x3, y3, x4, y4), Math.abs(bB - bT))
      // }
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
      console.log(`p1: ${best1x},${best1y} | p2: ${best2x},${best2y} | p3: ${x5},${y5}`)
      return calcTriangleArea(best1x, best1y, best2x, best2y, x5, y5)
    }

    if (!LTin && !RTin && !LBin && RBin) {
      // if (lt.x < pixelR && rt.y < pixelB) {  // for narrow lines
      //   x1 = (pixelB - bL) / aL
      //   y1 = pixelB
      //   x2 = pixelL
      //   y2 = aL * x2 + bL
      //   x3 = pixelL
      //   y3 = aR * x3 + bR
      //   x4 = pixelR
      //   y4 = aR * x4 + bR
      //   return calcTrapezoidArea(calcDistance(x1, y1, x2, y2), calcDistance(x3, y3, x4, y4), Math.abs(bR - bL))
      // }
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
      console.log(`p1: ${best1x},${best1y} | p2: ${best2x},${best2y} | p3: ${x5},${y5}`)
      return calcTriangleArea(best1x, best1y, best2x, best2y, x5, y5)
      // xC = (pixelT - bR) / aR
      // xK = (pixelB - bT) / aT
      // if (xK >= pixLB.x && xK <= pixRB.x) {
      //   x1 = (pixelB - bT) / aT
      //   y1 = pixelB
      //   x2 = pixRB.x
      //   y2 = pixRB.y
      //   x3 = pixelR
      //   y3 = aT * x3 + bT
      //   return 1 - calcTriangleArea(x1, y1, x2, y2, x3, y3)
      // }
      // if (xC >= pixLT.x) {
      //   x1 = (pixelT - bR) / aR
      //   y1 = pixelT
      //   x2 = pixelR
      //   y2 = aR * x2 + bR
      //   x3 = pixRT.x
      //   y3 = pixRT.y
      //   const firstArea = calcTriangleArea(x1, y1, x2, y2, x3, y3)
      //   x4 = (pixelB - bL) / aL
      //   y4 = pixelB
      //   x5 = (pixelT - bL) / aL
      //   y5 = pixelT
      //   return 1 - firstArea - ((x5 - pixLT.x) * (x4 - pixLB.x)) / 2
      // } else {
      //   x1 = (pixelB - bL) / aL
      //   y1 = pixelB
      //   x2 = pixelL
      //   y2 = aL * x2 + bL
      //   x3 = pixLB.x
      //   y3 = pixLB.y
      //   const firstArea = calcTriangleArea(x1, y1, x2, y2, x3, y3)
      //   x4 = pixelL
      //   y4 = aR * x4 + bR
      //   x5 = pixelR
      //   y5 = aR * x5 + bR
      //   return 1 - firstArea - ((y5 - pixLT.y) * (y4 - pixRT.y)) / 2
      // }
    }

    if (!LTin && !RTin && LBin && !RBin) {
      // if (rt.x > pixelL &&  rb.y < pixelB) {  // for narrow lines
      //   x1 = pixelL
      //   y1 = aT * x1 + bT
      //   x2 = pixelR
      //   y2 = aT * x2 + bT
      //   x3 = pixelR
      //   y3 = aB * x3 + bB
      //   x4 = (pixelB - bB) / aB
      //   y4 = pixelB
      //   return calcTrapezoidArea(calcDistance(x1, y1, x2, y2), calcDistance(x3, y3, x4, y4), Math.abs(bB - bT))
      // }
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
      console.log(`p1: ${best1x},${best1y} | p2: ${best2x},${best2y} | p3: ${x5},${y5}`)
      return calcTriangleArea(best1x, best1y, best2x, best2y, x5, y5)
    }

    // 0 booleans are true
    x1 = (pixelT - bL) / aL
    x2 = (pixelT - bL) / aL
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

  const shiftedPointA: IPoint = {
    x: Math.floor(points[0].x),
    y: Math.floor(points[0].y),
  }
  const shiftedPointB: IPoint = {
    x: Math.floor(points[1].x),
    y: Math.floor(points[1].y),
  }
  const shiftedPoints = [shiftedPointA, shiftedPointB]
  const dist = lineWidth / 2
  const start = shiftedPoints[0].x < shiftedPoints[1].x ? shiftedPoints[0] : shiftedPoints[1]
  const end = shiftedPoints[0].x > shiftedPoints[1].x ? shiftedPoints[0] : shiftedPoints[1]
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
  }

  if (start.x === end.x) {
    end.x += 1
  }
  // first case
  // if (start.x === start.y) {
  //   lt.x = start.x - d.x
  //   lt.y = start.y

  //   rt.x = start.x + d.x
  //   rt.y = start.y

  //   lb.x = end.x - d.x
  //   lb.y = end.y

  //   rb.x = end.x + d.x
  //   rb.y = end.y
  // }

  // if (end.x === end.y) {
  //   lt.x = start.x
  //   lt.y = start.y - d.y

  //   rt.x = start.x
  //   rt.y = start.y - d.y

  //   lb.x = end.x
  //   lb.y = end.y + d.y

  //   rb.x = end.x
  //   rb.y = end.y + d.y
  // }

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
      backgroundColor * (1 - lineOpacity * share) + lineColor * lineOpacity * share
    )
  }

  const newPixels = [...pixels]

  for (let i = 0; i < pixels.length; i += 3) {
    const point = calcPixelPosition(i / 3)
    const share = countPercentageBasic(point)
    if (share > 0 && share < 1) {
      console.log(`cX: ${point.x}, cY: ${point.y}, share: ${share}`)
    }
    for (let j = 0; j < 3; j += 1) {
      // if (share > 0 && share < 1) {
      //   if (j === 0) {
      //     newPixels[i + j] = 255
      //   } else {
      //     newPixels[i + j] = 0
      //   }
      // } else {
      //   newPixels[i + j] = mixColor(pixels[i + j], lineColor[j], share)
      // }
      newPixels[i + j] = mixColor(pixels[i + j], lineColor[j], share)
    }
  }

  return newPixels
}
