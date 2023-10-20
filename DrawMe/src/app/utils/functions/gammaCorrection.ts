import { produce } from "immer"

import { IImage } from "@/store/slices/image/types"

/* eslint-disable no-param-reassign */
export function gammaCorrection(image: IImage, gamma: number) {
  if (gamma === 0) return sRGBCorrection(image)

  return produce(image, draft => {
    if (image.isP6)
      for (let i = 0; i < draft.pixels.length; i += 3) {
        const r = draft.pixels[i] / draft.maxColorValue
        const g = draft.pixels[i + 1] / draft.maxColorValue
        const b = draft.pixels[i + 2] / draft.maxColorValue

        const rGamma = Math.pow(r, gamma)
        const gGamma = Math.pow(g, gamma)
        const bGamma = Math.pow(b, gamma)

        draft.pixels[i] = rGamma * draft.maxColorValue
        draft.pixels[i + 1] = gGamma * draft.maxColorValue
        draft.pixels[i + 2] = bGamma * draft.maxColorValue
      }
    else
      for (let i = 0; i < draft.pixels.length; i++) {
        const pixel = draft.pixels[i] / draft.maxColorValue

        const pixelGamma = Math.pow(pixel, gamma)

        draft.pixels[i] = pixelGamma * draft.maxColorValue
      }
  })
}

export function inverseGammaCorrection(image: IImage, gamma: number) {
  if (gamma === 0) return inverseSRGBCorrection(image)
  return gammaCorrection(image, 1 / gamma)
}

function sRGBCorrection(image: IImage) {
  return produce(image, draft => {
    if (image.isP6)
      for (let i = 0; i < draft.pixels.length; i += 3) {
        const r = draft.pixels[i] / draft.maxColorValue
        const g = draft.pixels[i + 1] / draft.maxColorValue
        const b = draft.pixels[i + 2] / draft.maxColorValue

        const rLinear =
          r <= 0.04045 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4)
        const gLinear =
          g <= 0.04045 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4)
        const bLinear =
          b <= 0.04045 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4)

        const rSRGB = rLinear * draft.maxColorValue
        const gSRGB = gLinear * draft.maxColorValue
        const bSRGB = bLinear * draft.maxColorValue

        draft.pixels[i] = rSRGB
        draft.pixels[i + 1] = gSRGB
        draft.pixels[i + 2] = bSRGB
      }
    else
      for (let i = 0; i < draft.pixels.length; i++) {
        const pixel = draft.pixels[i] / draft.maxColorValue

        const pixelLinear =
          pixel <= 0.04045
            ? pixel / 12.92
            : Math.pow((pixel + 0.055) / 1.055, 2.4)

        draft.pixels[i] = pixelLinear * draft.maxColorValue
      }
  })
}

function inverseSRGBCorrection(image: IImage) {
  return produce(image, draft => {
    if (image.isP6)
      for (let i = 0; i < draft.pixels.length; i += 3) {
        const r = draft.pixels[i] / draft.maxColorValue
        const g = draft.pixels[i + 1] / draft.maxColorValue
        const b = draft.pixels[i + 2] / draft.maxColorValue

        const rSRGB =
          r <= 0.0031308 ? r * 12.92 : 1.055 * Math.pow(r, 1 / 2.4) - 0.055
        const gSRGB =
          g <= 0.0031308 ? g * 12.92 : 1.055 * Math.pow(g, 1 / 2.4) - 0.055
        const bSRGB =
          b <= 0.0031308 ? b * 12.92 : 1.055 * Math.pow(b, 1 / 2.4) - 0.055

        draft.pixels[i] = rSRGB * draft.maxColorValue
        draft.pixels[i + 1] = gSRGB * draft.maxColorValue
        draft.pixels[i + 2] = bSRGB * draft.maxColorValue
      }
    else
      for (let i = 0; i < draft.pixels.length; i++) {
        const pixel = draft.pixels[i] / draft.maxColorValue

        const pixelSRGB =
          pixel <= 0.0031308
            ? pixel * 12.92
            : 1.055 * Math.pow(pixel, 1 / 2.4) - 0.055

        draft.pixels[i] = pixelSRGB * draft.maxColorValue
      }
  })
}
