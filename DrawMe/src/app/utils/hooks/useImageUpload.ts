import {
  ChangeEventHandler,
  MouseEventHandler,
  useCallback,
  useRef,
  useState,
} from "react"

import { useAppDispatch } from "@/store"
import { setGamma, setImage } from "@/store/slices/image"
import { IImage } from "@/store/slices/image/types"
import { processPNG, processPPM } from "@/utils/functions"

export default function useImageUpload(callback?: () => void) {
  const dispatch = useAppDispatch()

  const input = useRef<HTMLInputElement>(null)

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileUpload = useCallback<ChangeEventHandler<HTMLInputElement>>(
    event => {
      if (!event.target.files?.length) return
      const file = event.target.files[0]

      const reader = new FileReader()

      reader.onloadend = event => {
        try {
          const result = event.target?.result as ArrayBuffer
          const uint8Array = new Uint8Array(result)

          if (uint8Array.length < 4) throw new Error("Файл слишком короткий")

          let image: IImage
          let gamma = 0
          if (
            uint8Array[0] === 80 && // P
            (uint8Array[1] === 53 || uint8Array[1] === 54) // 5 or 6
          )
            image = processPPM(result)
          else if (
            // check for png
            uint8Array[0] === 137 && // PNG signature
            uint8Array[1] === 80 && // P
            uint8Array[2] === 78 && // N
            uint8Array[3] === 71 // G
          )
            [image, gamma] = processPNG(result)
          else throw new Error("Неверный формат файла")

          input.current!.value = "" // reset input value to allow uploading the same file
          if (gamma !== 0) {
            dispatch(setImage(image))
            dispatch(setGamma({ gamma: 1 / gamma, convertedGamma: gamma }))
          } else dispatch(setImage(image))
          callback?.()
        } catch (error) {
          if (error instanceof Error) setError(error.message)
          reader.abort()
          return
        } finally {
          setIsLoading(false)
        }
      }

      reader.onloadstart = () => {
        setIsLoading(true)
        setError(null)
      }

      reader.readAsArrayBuffer(file)
    },
    [callback, dispatch]
  )

  const handleClick = useCallback<MouseEventHandler<HTMLElement>>(
    () => input.current?.click(),
    []
  )

  return {
    inputProps: {
      ref: input,
      type: "file",
      accept: ".pgm,.ppm,.png",
      onChange: handleFileUpload,
    },
    handleClick,
    isLoading,
    error,
  }
}
