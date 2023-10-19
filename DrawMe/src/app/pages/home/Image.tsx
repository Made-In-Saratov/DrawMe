import { Helmet } from "react-helmet-async"
import styled from "styled-components"

import Button from "@/components/Button"
import Canvas from "@/components/Canvas"
import EditWrapper from "@/components/EditWrapper"
import { useAppSelector } from "@/store"
import useImageSave from "@/utils/hooks/useImageSave"
import useImageUpload from "@/utils/hooks/useImageUpoad"

export default function Image() {
  const { inputProps, handleClick, isLoading, error } = useImageUpload()

  const handleSaveClick = useImageSave()

  const image = useAppSelector(({ image }) => image.src)

  const isDownloadDisabled = !image

  return (
    <>
      <Helmet>
        <title>Редактирование изображения</title>
      </Helmet>

      <Canvas image={image} />

      <StyledEditWrapper>
        <Button data-type="secondary" onClick={handleClick}>
          {isLoading ? "Загрузка..." : error ? "Ошибка" : "Загрузить другое"}
          <input {...inputProps} />
        </Button>
        <Button
          data-type="primary"
          onClick={handleSaveClick}
          disabled={isDownloadDisabled}
        >
          Скачать изображение
        </Button>
      </StyledEditWrapper>
    </>
  )
}

const StyledEditWrapper = styled(EditWrapper)`
  display: flex;
  gap: 24px;
  padding: 20px 24px;
`
