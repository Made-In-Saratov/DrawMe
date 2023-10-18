import { MouseEventHandler, useCallback } from "react"

import { useAppSelector } from "@/store"

export default function useImageSave() {
  const image = useAppSelector(({ image }) => image)

  const handleClick = useCallback<MouseEventHandler<HTMLElement>>(() => {
    if (image.pixels.length === 0) return

    const encoder = new TextEncoder()
    const header = encoder.encode(
      `P${image.isP6 ? "6" : "5"}\n${image.width} ${image.height}\n${
        image.maxColorValue
      }\n`
    )

    const blob = new Blob([header, Uint8Array.from(image.pixels)], {
      type: image.isP6 ? "image/x-portable-pixmap" : "image/x-portable-graymap",
    })

    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = `image.${image.isP6 ? "ppm" : "pgm"}`

    link.style.display = "none"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }, [image])

  return handleClick
}
