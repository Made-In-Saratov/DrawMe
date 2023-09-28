import styled from "styled-components";
import { FC, useEffect, useRef } from "react";

interface ICanvasProps {
  image: string,
}

const CanvasWithImage: FC<ICanvasProps> = ({ image }) => {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvas.current) return;
    const context = canvas.current.getContext('2d');
    const img = new Image();
    img.src = image;
    img.onload = () => {
      if (!canvas.current) return;
      context?.drawImage(img, 0, 0, canvas.current.width, canvas.current.height);
    }
    // context?.drawImage(img, 0, 0, canvas.current.width, canvas.current.height);
  }, []);

  return (
    <Canvas ref={canvas}>
    </Canvas>
  )
}

const Canvas = styled.canvas`
  width: 100vh;
  height: 100vh;
`

export default CanvasWithImage;
