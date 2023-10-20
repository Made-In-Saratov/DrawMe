import { MouseEventHandler, useCallback } from "react"

import { useAppSelector } from "@/store"
import { countSelectedChannels } from "@/utils/functions"

export default function useImageSave() {
  const { space, channels, src: image } = useAppSelector(({ image }) => image)

  const handleClick = useCallback<MouseEventHandler<HTMLElement>>(() => {
    if (!image) return

    const encoder = new TextEncoder()
    let blob: Blob

    if (!image.isP6) {
      const header = encoder.encode(
        `P5\n${image.width} ${image.height}\n${image.maxColorValue}\n`
      )

      const pixels = new Uint8Array(image.pixels.length)
      for (let i = 0; i < image.pixels.length; i += 3) {
        pixels[i / 3] =
          (channels[0] ? image.pixels[i] : 0) +
          (channels[1] ? image.pixels[i + 1] : 0) +
          (channels[2] ? image.pixels[i + 2] : 0)
      }

      blob = new Blob([header, pixels], {
        type: "image/x-portable-graymap",
      })
    } else if (countSelectedChannels(channels) === 1) {
      const header = encoder.encode(
        `P5\n${image.width} ${image.height}\n${image.maxColorValue}\n`
      )

      const pixels = new Uint8Array(image.width * image.height)
      const channelNumber = channels.indexOf(true)
      for (let i = 0; i < image.pixels.length; i += 3) {
        pixels[i / 3] = image.pixels[i + channelNumber]
      }

      blob = new Blob([header, pixels], {
        type: "image/x-portable-graymap",
      })
    } else {
      const header = encoder.encode(
        `P6\n${image.width} ${image.height}\n${image.maxColorValue}\n`
      )

      const pixels = new Uint8Array(image.pixels.length)
      for (let i = 0; i < image.pixels.length; i += 3) {
        pixels[i] = channels[0] ? image.pixels[i] : 0
        pixels[i + 1] = channels[1] ? image.pixels[i + 1] : 0
        pixels[i + 2] = channels[2] ? image.pixels[i + 2] : 0
      }

      blob = new Blob([header, pixels], {
        type: "image/x-portable-pixmap",
      })
    }

    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = `image_${space}.${
      image.isP6 || countSelectedChannels(channels) === 1 ? "ppm" : "pgm"
    }`

    link.style.display = "none"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }, [channels, image, space])

  return handleClick
}
