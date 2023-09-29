import { MouseEventHandler, useCallback } from "react"

import { Helmet } from "react-helmet-async"
import styled from "styled-components"

import Button from "@/components/Button"
import Canvas from "@/components/Canvas"
import useImageSave from "@/utils/hooks/useImageSave"
import { IImage } from "@/utils/types/image"

interface IDrawProps {
  goBack: () => void
  image: IImage
}

export default function Draw({ goBack, image }: IDrawProps) {
  const handleSaveClick = useImageSave(image)

  const handleLoadClick = useCallback<MouseEventHandler<HTMLButtonElement>>(
    goBack,
    [goBack]
  )

  return (
    <>
      <Helmet>
        <title>Редактирование изображения</title>
      </Helmet>

      <Wrapper>
        <Canvas image={image} />
        <ButtonWrapper>
          <Button data-type="secondary" onClick={handleLoadClick}>
            Загрузить другое
          </Button>
          <Button data-type="primary" onClick={handleSaveClick}>
            Скачать изображение
          </Button>
        </ButtonWrapper>
      </Wrapper>
    </>
  )
}

const Wrapper = styled.div`
  position: relative;

  min-height: 100vh;
  box-sizing: border-box;
  padding: 20px;
`

const ButtonWrapper = styled.div`
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);

  display: flex;
  gap: 24px;
  padding: 20px 24px;

  border-radius: 30px;
  background: rgba(255, 255, 255, 0.8);
  box-shadow: 4px 8px 20px 0px rgba(16, 0, 65, 0.15);
  backdrop-filter: blur(8px);
`
