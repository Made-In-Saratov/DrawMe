import { Helmet } from "react-helmet-async"

import Button from "@/components/Button"
import Canvas from "@/components/Canvas"
import EditWrapper from "@/components/EditWrapper"
import useImageSave from "@/utils/hooks/useImageSave"
import useImageUpload from "@/utils/hooks/useImageUpload"
import { IImage } from "@/utils/types/image"

interface IImageProps {
  image: IImage | null
  setImage: (image: IImage) => void
}

export default function Image({ image, setImage }: IImageProps) {
  const { inputProps, handleClick, isLoading, error } = useImageUpload(setImage)

  const handleSaveClick = useImageSave(image)

  const isDownloadDisabled = !image

  return (
    <>
      <Helmet>
        <title>Редактирование изображения</title>
      </Helmet>

      <Canvas image={image} />
      <EditWrapper>
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
      </EditWrapper>
    </>
  )
}
