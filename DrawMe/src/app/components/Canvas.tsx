import { useEffect, useRef } from "react"

import styled from "styled-components"

interface ICanvasProps {
  image: string
}

export default function Canvas({ image }: ICanvasProps) {
  const canvas = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvas.current) return
    const context = canvas.current.getContext("2d")
    const img = new Image()
    img.src = image
    img.onload = () => {
      if (!canvas.current) return
      context?.drawImage(img, 0, 0, canvas.current.width, canvas.current.height)
    }
    // context?.drawImage(img, 0, 0, canvas.current.width, canvas.current.height);
  }, [image])

  return <StyledCanvas ref={canvas} />
}

const StyledCanvas = styled.canvas`
  width: 100vh;
  height: 100vh;
`
