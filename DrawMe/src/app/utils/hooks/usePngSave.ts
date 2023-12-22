import { MouseEventHandler, useCallback } from "react"

import { useAppSelector } from "@/store"
import { countSelectedChannels } from "@/utils/functions"
import encodeIDAT from "@/utils/functions/chunks/encodeIDAT"
import encodeIEND from "@/utils/functions/chunks/encodeIEND"
import encodeIHDR from "@/utils/functions/chunks/encodeIHDR"

export default function usePngSave() {
  const { space, channels, src: image } = useAppSelector(({ image }) => image)

  const handleClick = useCallback<MouseEventHandler<HTMLElement>>(() => {
    if (!image) return

    const pngSignature = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10])

    const header = encodeIHDR(
      image,
      countSelectedChannels(channels) > 1 && image.isP6
    )

    let pixels: number[]
    let bytesPerPixel: number
    if (!image.isP6) {
      pixels = new Array(image.pixels.length / 3)
      for (let i = 0; i < image.pixels.length / 3; i++) {
        pixels[i] = image.pixels[i * 3]
      }
      bytesPerPixel = 1
    } else if (countSelectedChannels(channels) === 1) {
      pixels = new Array(image.width * image.height)
      const channelNumber = channels.indexOf(true)
      for (let i = 0; i < image.pixels.length; i += 3) {
        pixels[i / 3] = image.pixels[i + channelNumber]
      }
      bytesPerPixel = 1
    } else {
      pixels = new Array(image.pixels.length)
      for (let i = 0; i < image.pixels.length; i += 3) {
        pixels[i] = channels[0] ? image.pixels[i] : 0
        pixels[i + 1] = channels[1] ? image.pixels[i + 1] : 0
        pixels[i + 2] = channels[2] ? image.pixels[i + 2] : 0
      }
      bytesPerPixel = 3
    }

    const data = encodeIDAT(pixels, bytesPerPixel, image.width)

    const end = encodeIEND()

    const blob = new Blob([pngSignature, header, data, end], {
      type: "image/png",
    })

    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = `image_${space}.png`

    link.style.display = "none"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }, [channels, image, space])

  return handleClick
}
