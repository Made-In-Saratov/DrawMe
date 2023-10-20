import { MouseEventHandler, useCallback } from "react"

import { useAppSelector } from "@/store"
import { countSelectedChannels } from "@/utils/functions"

export default function useImageSave() {
  const { channels, src: image } = useAppSelector(({ image }) => image)

  const handleClick = useCallback<MouseEventHandler<HTMLElement>>(() => {
    if (!image) return

    const encoder = new TextEncoder()
    let blob: Blob

    if (countSelectedChannels(channels) === 1) {
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
        `P${image.isP6 ? "6" : "5"}\n${image.width} ${image.height}\n${
          image.maxColorValue
        }\n`
      )

      const pixels = new Uint8Array(image.pixels.length)
      for (let i = 0; i < image.pixels.length; i += 3) {
        pixels[i] = channels[0] ? image.pixels[i] : 0
        pixels[i + 1] = channels[1] ? image.pixels[i + 1] : 0
        pixels[i + 2] = channels[2] ? image.pixels[i + 2] : 0
      }

      blob = new Blob([header, pixels], {
        type: image.isP6
          ? "image/x-portable-pixmap"
          : "image/x-portable-graymap",
      })
    }

    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = `image.${image.isP6 ? "ppm" : "pgm"}`

    link.style.display = "none"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }, [channels, image])

  return handleClick
}
