/* eslint-disable no-param-reassign */

type UnfilterFunctionT = (
  scanline: Uint8Array,
  pixels: number[],
  bpp: number,
  offset: number,
  length: number
) => void

const unfilters: Record<number, UnfilterFunctionT> = {
  0: UnfilterNone,
  1: UnfilterSub,
  2: UnfilterUp,
  3: UnfilterAverage,
  4: UnfilterPaeth,
}

function UnfilterNone(
  scanline: Uint8Array,
  pixels: number[],
  bpp: number,
  offset: number,
  length: number
) {
  for (let i = 0, to = length; i < to; i++) pixels[offset + i] = scanline[i]
}

function UnfilterSub(
  scanline: Uint8Array,
  pixels: number[],
  bpp: number,
  offset: number,
  length: number
) {
  let i = 0
  for (; i < bpp; i++) pixels[offset + i] = scanline[i]
  for (; i < length; i++) {
    // Raw(x) + Raw(x - bpp)
    pixels[offset + i] = (scanline[i] + pixels[offset + i - bpp]) & 0xff
  }
}

function UnfilterUp(
  scanline: Uint8Array,
  pixels: number[],
  bpp: number,
  offset: number,
  length: number
) {
  let i = 0,
    byte,
    prev
  // Prior(x) is 0 for all x on the first scanline
  if (offset - length < 0)
    for (; i < length; i++) {
      pixels[offset + i] = scanline[i]
    }
  else
    for (; i < length; i++) {
      // Raw(x)
      byte = scanline[i]
      // Prior(x)
      prev = pixels[offset + i - length]
      pixels[offset + i] = (byte + prev) & 0xff
    }
}

function UnfilterAverage(
  scanline: Uint8Array,
  pixels: number[],
  bpp: number,
  offset: number,
  length: number
) {
  let i = 0,
    byte,
    prev,
    prior
  if (offset === 0) {
    // Prior(x) == 0 && Raw(x - bpp) == 0
    for (; i < bpp; i++) {
      pixels[offset + i] = scanline[i]
    }
    // Prior(x) == 0 && Raw(x - bpp) != 0 (right shift, prevent doubles)
    for (; i < length; i++) {
      pixels[offset + i] =
        (scanline[i] + (pixels[offset + i - bpp] >> 1)) & 0xff
    }
  } else {
    // Prior(x) != 0 && Raw(x - bpp) == 0
    for (; i < bpp; i++) {
      pixels[offset + i] =
        (scanline[i] + (pixels[offset - length + i] >> 1)) & 0xff
    }
    // Prior(x) != 0 && Raw(x - bpp) != 0
    for (; i < length; i++) {
      byte = scanline[i]
      prev = pixels[offset + i - bpp]
      prior = pixels[offset + i - length]
      pixels[offset + i] = (byte + ((prev + prior) >> 1)) & 0xff
    }
  }
}

function UnfilterPaeth(
  scanline: Uint8Array,
  pixels: number[],
  bpp: number,
  offset: number,
  length: number
) {
  let i = 0,
    raw,
    a,
    b,
    c,
    p,
    pa,
    pb,
    pc,
    pr
  if (offset - length < 0) {
    // Prior(x) == 0 && Raw(x - bpp) == 0
    for (; i < bpp; i++) {
      pixels[offset + i] = scanline[i]
    }
    // Prior(x) == 0 && Raw(x - bpp) != 0
    // paethPredictor(x, 0, 0) is always x
    for (; i < length; i++) {
      pixels[offset + i] = (scanline[i] + pixels[offset + i - bpp]) & 0xff
    }
  } else {
    // Prior(x) != 0 && Raw(x - bpp) == 0
    // paethPredictor(x, 0, 0) is always x
    for (; i < bpp; i++) {
      pixels[offset + i] = (scanline[i] + pixels[offset + i - length]) & 0xff
    }
    // Prior(x) != 0 && Raw(x - bpp) != 0
    for (; i < length; i++) {
      raw = scanline[i]
      a = pixels[offset + i - bpp]
      b = pixels[offset + i - length]
      c = pixels[offset + i - length - bpp]
      p = a + b - c
      pa = Math.abs(p - a)
      pb = Math.abs(p - b)
      pc = Math.abs(p - c)
      if (pa <= pb && pa <= pc) pr = a
      else if (pb <= pc) pr = b
      else pr = c
      pixels[offset + i] = (raw + pr) & 0xff
    }
  }
}

export default unfilters
