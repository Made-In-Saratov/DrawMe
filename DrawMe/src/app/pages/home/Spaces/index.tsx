import React, { useCallback, useEffect, useRef, useState } from "react"

import { Helmet } from "react-helmet-async"
import styled from "styled-components"

import Button from "@/components/Button"
import Canvas from "@/components/Canvas"
import Dropdown from "@/components/Dropdown"
import EditWrapper from "@/components/EditWrapper"
import { SpacesT } from "@/pages/home/Spaces/types"
import { spaces } from "@/pages/home/Spaces/utils/spaces"
import { TabT } from "@/pages/home/types"
import { text14Medium } from "@/utils/fonts"
import { countNumberOfSelectedChannels } from "@/utils/functions"
import useImageSave from "@/utils/hooks/useImageSave"
import useImageUpload from "@/utils/hooks/useImageUpload"
import { IImage } from "@/utils/types/image"

interface ISpacesProps {
  image: IImage | null
  setImage: (image: IImage | null) => void
  setTab: (tab: TabT) => void
}

interface IDropdownItemProps {
  selected: boolean
}

interface ICheckboxProps {
  checked: boolean
}

export default function Spaces({ image, setImage, setTab }: ISpacesProps) {
  const [selectedSpace, setSelectedSpace] = useState<SpacesT>("RGB")
  const [selectedChannels, setSelectedChannels] = useState<boolean[]>([
    true,
    true,
    true,
  ])

  const uploadCallback = useCallback(
    (image: IImage) => {
      setImage(image)
      setTab("spaces")
    },
    [setImage, setTab]
  )

  const { inputProps, handleClick, isLoading, error } =
    useImageUpload(uploadCallback)

  const handleImageSave = (): IImage | null => {
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

  const handleSaveClick = useImageSave(handleImageSave())

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

      <EditWrapper>
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
              <ChannelLabel key={channelName}>
                <ChannelCheckbox
                  type="checkbox"
                  checked={selectedChannels[index]}
                  onChange={getCheckboxClickHandler(index)}
                />
                <ChannelName>Канал {channelName}</ChannelName>
              </ChannelLabel>
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
      </EditWrapper>
    </>
  )
}

const Column = styled.div`
  flex: 1;
`

const ChannelsList = styled.div`
  display: flex;
  gap: 8px;
  flex-direction: column;
  padding: 0 10px;
`

const ChannelCheckbox = styled.input<ICheckboxProps>`
  appearance: none;
  cursor: pointer;
  width: 20px;
  height: 20px;
  border: 1.5px solid var(--magenta);
  border-radius: 5px;
  color: #ffffff;

  ${({ checked }) =>
    checked &&
    `
    position: relative;
    border: none;
    background: linear-gradient(
            250deg,
            var(--magenta) 10%,
            var(--light-blue) 90%
    );

    &::before {
      content: '';
      display: block;
      position: absolute;
      left: 6.5px;
      top: 1.5px;
      width: 5px;
      height: 10px;
      border: solid white;
      border-width: 0 2px 2px 0;
      transform: rotate(45deg);
    }
  `}
`

const ChannelLabel = styled.label`
  display: flex;
  align-items: center;
  position: relative;
  cursor: pointer;
  ${text14Medium};
`

const ChannelName = styled.span`
  margin-left: 8px;
  word-wrap: nowrap;
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
