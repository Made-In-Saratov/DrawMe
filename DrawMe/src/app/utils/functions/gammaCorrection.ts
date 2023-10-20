import { produce } from "immer"

import { IImage } from "@/store/slices/image/types"

/* eslint-disable no-param-reassign */
export function gammaCorrection(image: IImage, gamma: number) {
  if (gamma === 0) return sRGBCorrection(image)

  return produce(image, draft => {
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
