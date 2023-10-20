import { useCallback, useState } from "react"

import { Helmet } from "react-helmet-async"
import styled from "styled-components"

import Button from "@/components/Button"
import Canvas from "@/components/Canvas"
import Checkbox from "@/components/Checkbox"
import Dropdown from "@/components/Dropdown"
import EditWrapper from "@/components/EditWrapper"
import { SpacesT } from "@/pages/home/Spaces/types"
import { spaces } from "@/pages/home/Spaces/utils/spaces"
import { useAppSelector } from "@/store"
import { text14, text14Medium } from "@/utils/fonts"
import { countNumberOfSelectedChannels } from "@/utils/functions"
import useImageSave from "@/utils/hooks/useImageSave"
import useImageUpload from "@/utils/hooks/useImageUpload"

export default function Spaces() {
  const [selectedSpace, setSelectedSpace] = useState<SpacesT>("RGB")
  const [selectedChannels, setSelectedChannels] = useState<boolean[]>([
    true,
    true,
    true,
  ])

  const image = useAppSelector(({ image }) => image.src)

  const { inputProps, handleClick, isLoading, error } = useImageUpload()

  const handleImageSave = () => {
    if (!image) return null

    const result = countNumberOfSelectedChannels(selectedChannels)
    if (result === 1 && image.isP6) {
      const copyOfImage = Object.create(image)

      const {
        pixels: rawPixels,
        width,
        height,
        maxColorValue,
        isP6,
      } = copyOfImage
      const pixels =
        maxColorValue > 255 ? new Uint16Array(rawPixels) : rawPixels // convert to Uint16Array if maxColorValue > 255
      const norm = 255 / maxColorValue // normalization coefficient
      const newPixels = new Uint8Array(pixels.length / 3)

      let idx = 0
      for (let i = 0; i < width * height; i++) {
        newPixels[idx] =
          pixels[i * 3 + selectedChannels.findIndex(el => el)] * norm
        idx += 1
      }

      console.log(copyOfImage.width, copyOfImage.height, copyOfImage.isP6)
      // copyOfImage.width = width / 3;
      // copyOfImage.height = height / 3;
      copyOfImage.pixels = newPixels
      copyOfImage.isP6 = false

      console.log(isP6)
      console.log(pixels)
      console.log(newPixels)

      return copyOfImage
    }

    return image
  }

  const handleSaveClick = useImageSave()

  const getCheckboxClickHandler = useCallback(
    (index: number) => () =>
      setSelectedChannels(prevState => {
        const copyOfSelectedChannels: boolean[] = [...prevState]
        copyOfSelectedChannels[index] = !prevState[index]
        return copyOfSelectedChannels
      }),
    []
  )

  const handleItemChange = useCallback(
    (item: string) => setSelectedSpace(item as SpacesT),
    [setSelectedSpace]
  )

  const isDownloadDisabled = !image

  return (
    <>
      <Helmet>
        <title>Изменение цветового пространства</title>
      </Helmet>

      <Canvas
        image={image}
        space={spaces[selectedSpace]}
        selectedChannels={selectedChannels}
      />

      <StyledEditWrapper>
        <Column>
          <Dropdown
            items={Object.keys(spaces)}
            activeItem={selectedSpace}
            setActiveItem={handleItemChange}
          />
          <DownloadButton onClick={handleClick}>
            {isLoading ? "Загрузка..." : error ? "Ошибка" : "Загрузить другое"}
            <input {...inputProps} />
          </DownloadButton>
        </Column>

        <Column>
          <ChannelsList>
            {spaces[selectedSpace].channels.map((channelName, index) => (
              <StyledCheckbox
                key={channelName}
                checked={selectedChannels[index]}
                onChange={getCheckboxClickHandler(index)}
              >
                Канал {channelName}
              </StyledCheckbox>
            ))}
          </ChannelsList>
        </Column>

        <Column>
          <Button
            data-type="primary"
            onClick={handleSaveClick}
            disabled={isDownloadDisabled}
          >
            Скачать изображение
          </Button>
        </Column>
      </StyledEditWrapper>
    </>
  )
}

const StyledEditWrapper = styled(EditWrapper)`
  display: flex;
  align-items: center;
  gap: 40px;
  padding: 20px 24px;
`

const Column = styled.div`
  flex: 1;
`

const ChannelsList = styled.div`
  display: flex;
  gap: 8px;
  flex-direction: column;
  padding: 0 10px;
`

const DownloadButton = styled.button`
  cursor: pointer;
  background: transparent;
  border: none;
  outline: none;

  width: 100%;
  padding: 0;

  margin-top: 8px;

  text-decoration: underline;
  ${text14Medium}
  color: var(--dark-blue);

  > input {
    display: none;
  }
`

const StyledCheckbox = styled(Checkbox)`
  display: flex;
  align-items: center;
  gap: 8px;

  width: 100px; // fix width to prevent jumping

  ${text14}
  color: var(--dark-blue);
`
