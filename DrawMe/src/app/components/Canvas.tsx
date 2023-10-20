import React, { useEffect, useRef } from "react"

import styled from "styled-components"

import { useAppSelector } from "@/store"
import { IImage } from "@/store/slices/image/types"
import { text20 } from "@/utils/fonts"
import {
  inverseGammaCorrection,
  gammaCorrection,
  countSelectedChannels,
} from "@/utils/functions"
import { spaces } from "@/utils/spaces"

function Canvas() {
  const {
    space,
    channels,
    gamma,
    src: image,
  } = useAppSelector(({ image }) => image)

  const canvas = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvas.current || !image) return

    const spaceDetails = spaces[space]

    // const processedImage =
    //   gamma !== 0
    //     ? gammaCorrection(inverseGammaCorrection(image, 0), gamma)
    //     : image

    const { pixels, width, height, maxColorValue } = image
    canvas.current.width = width
    canvas.current.height = height
    // FIXME: conversion doesn't work for 2 byte pixels
    if (maxColorValue > 255) throw new Error("2 byte pixels are not supported")
    // TODO: add support for non-255 maxColorValue
    const norm = 255 / maxColorValue // normalization coefficient

    // clamped values are integers in range [0, 255]
    const clampedArray = new Uint8ClampedArray(width * height * 4)

    for (let i = 0; i < width * height; i++) {
      if (countSelectedChannels(channels) === 1) {
        clampedArray[i * 4] = pixels[i * 3 + channels.indexOf(true)]
        clampedArray[i * 4 + 1] = pixels[i * 3 + channels.indexOf(true)]
        clampedArray[i * 4 + 2] = pixels[i * 3 + channels.indexOf(true)]
      } else {
        const converted = spaceDetails.reverseConverter([
          channels[0] ? pixels[i * 3] : 0,
          channels[1] ? pixels[i * 3 + 1] : 0,
          channels[2] ? pixels[i * 3 + 2] : 0,
        ])
        clampedArray[i * 4] = converted[0]
        clampedArray[i * 4 + 1] = converted[1]
        clampedArray[i * 4 + 2] = converted[2]
      }
      clampedArray[i * 4 + 3] = 255
    }

    const drawData = new ImageData(clampedArray, width, height)
    const context = canvas.current.getContext("2d")
    context?.putImageData(drawData, 0, 0)
  }, [image, gamma, space, channels])

  if (!image)
    return (
      <NoImage>
        <p>Изображение не загружено</p>
      </NoImage>
    )

  return (
    <Wrapper>
      <StyledCanvas ref={canvas} />
    </Wrapper>
  )
}

const Wrapper = styled.div`
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 4px 8px 20px 0 rgba(16, 0, 65, 0.15);

  width: fit-content;
  height: fit-content;
  padding: 15px;
  box-sizing: border-box;

  margin: 0 auto;
`

const StyledCanvas = styled.canvas`
  border-radius: 6px;
  border: 1px solid var(--white);

  max-width: calc(95vw - 32px);
  max-height: calc(95vh - 32px);
`

const NoImage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;

  > p {
    margin: 0;
    ${text20};
    text-align: center;
  }
`

export default React.memo(Canvas)
