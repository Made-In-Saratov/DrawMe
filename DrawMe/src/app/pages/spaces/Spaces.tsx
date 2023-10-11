import React, { useCallback, useEffect, useRef, useState } from "react"

import styled from "styled-components"

import Button from "@/components/Button"
import { text14, text14Medium, text16, text16Medium } from "@/utils/fonts"
import useImageUpload from "@/utils/hooks/useImageUpoad"
import { IImage } from "@/utils/types/image"
import { Helmet } from "react-helmet-async"
import Canvas from "@/components/Canvas"
import EditWrapper from "@/components/EditWrapper"
import useImageSave from "@/utils/hooks/useImageSave"
import { TabT } from "@/pages/home/types"
import { Space, Spaces } from "@/utils/types/space"

interface ISpacesProps {
  image: IImage | null
  setImage: (image: IImage | null) => void
  setTab: (tab: TabT) => void
}

interface IDropdownItemProps {
  selected: boolean;
}

interface ICheckboxProps {
  checked: boolean;
}

export default function Spaces({ image, setImage, setTab }: ISpacesProps) {
  const spaces: { [key in Spaces]: Space } = {
    "RGB": {
      "name": "RGB",
      "channels": ["R", "G", "B"],
    },
    "HSL": {
      "name": "HSL",
      "channels": ["H", "S", "L"],
    },
    "HSV": {
      "name": "HSV",
      "channels": ["H", "S", "V"],
    },
    "YCbCr.601": {
      "name": "YCbCr.601",
      "channels": ["Y", "Cb", "Cr"],
    },
    "YCbCr.709": {
      "name": "YCbCr.709",
      "channels": ["Y", "Cb", "Cr"],
    },
    "YCoCg": {
      "name": "YCoCg",
      "channels": ["Y", "Co", "Cg"],
    },
    "CMY": {
      "name": "CMY",
      "channels": ["C", "M", "Y"],
    },
  };
  const [isDropdownShowed, setDropdownShowed] = useState<boolean>(false);
  const [selectedSpace, setSelectedSpace] = useState<Spaces>("RGB");
  const [selectedChannels, setSelectedChannels] = useState<boolean[]>(
    Array(3).fill(false)
  );

  const dropdownRef = useRef<HTMLDivElement>(null);

  const uploadCallback = useCallback(
    (image: IImage) => {
      setImage(image)
      setTab("spaces")
    },
    [setImage, setTab]
  )

  const { inputProps, handleClick, isLoading, error } =
    useImageUpload(uploadCallback)

  const navigateToImage = useCallback(() => setTab("spaces"), [setTab])

  const handleSaveClick = useImageSave(image)

  const isDownloadDisabled = !image

  const openDropdown = () => {
    setDropdownShowed(true);
  }

  const handleDropdownItemClick = (_: React.MouseEvent<HTMLDivElement>, name: Spaces): void => {
    setSelectedSpace(name);
    setSelectedChannels([false, false, false]);
    setDropdownShowed(false);
  }

  const handleCheckboxClick = (_: React.MouseEvent<HTMLInputElement>, idx: number): void => {
    const copyOfSelectedChannels: boolean[] = [...selectedChannels];
    copyOfSelectedChannels[idx] = !selectedChannels[idx];
    console.log('clicked', copyOfSelectedChannels);
    setSelectedChannels(copyOfSelectedChannels);
  }

  return (
    <>
      <Helmet>
        <title>Изменение цветового пространства</title>
      </Helmet>

      <Canvas image={image} />
      <EditWrapper>
        <Column>
          <DropdownWrapper>
            <DropdownButton data-type="secondary" onClick={openDropdown}>
              <HorizontalArrow />
              {selectedSpace}
            </DropdownButton>
            {isDropdownShowed && (
              <Dropdown ref={dropdownRef}>
                {Object.keys(spaces).map((spaceKey: string) => {
                  const name: string = spaces[spaceKey as Spaces].name;
                  return (
                    <DropdownItem
                      key={name}
                      selected={selectedSpace === name}
                      onClick={(event) => handleDropdownItemClick(event, name as Spaces)}
                    >
                      {name}
                    </DropdownItem>
                  );
                })}
              </Dropdown>
            )}
          </DropdownWrapper>
          <DownloadButton onClick={handleClick}>
            {isLoading ? "Загрузка..." : error ? "Ошибка" : "Загрузить другое"}
            <input {...inputProps} />
          </DownloadButton>
        </Column>
        <Column>
          <ChannelsList>
            {spaces[selectedSpace].channels.map((channelName: string, idx: number) => (
              <ChannelLabel>
                <ChannelCheckbox
                  type="checkbox"
                  checked={selectedChannels[idx]}
                  onClick={(event) => handleCheckboxClick(event, idx)}
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

const HorizontalArrow = styled.span`
  display: block;
  width: 10px;
  height: 10px;
  border: solid black;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg) translateY(-2px);
`

const DropdownWrapper = styled.div`
  position: relative;
`

const DropdownButton = styled(Button)`
  display: flex;
  justify-content: left;
  align-items: center;
  gap: 8px;
  padding-left: 20px;
  padding-right: 10px;
  width: 140px;
`

const Dropdown = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  left: 0;
  bottom: -1px;
  width: 100%;
  padding: 16px 0;
  background: #fff;
  border-radius: 20px;
  box-shadow: 4px 8px 20px 0px rgba(16, 0, 65, 0.15);
  cursor: pointer;
  ${text16Medium}
`

const DropdownItem = styled.div<IDropdownItemProps>`
  position: relative;
  margin-left: 32px;
  padding: 6px;
  &:hover {
    color: var(--magenta);
  }
  ${({ selected }) => selected && `
    color: var(--light-blue);
    &::before {
      content: '';
      display: block;
      position: absolute;
      width: 6px;
      height: 6px;
      border-style: solid;
      border-color: var(--light-blue);
      border-width: 2px 2px 0 0;
      top: 50%;
      left: -16px;
      transform: rotate(45deg) translateY(-50%);
    }
  `}
`

const ChannelsList = styled.div`
  display: flex;
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

  ${({ checked }) => checked && `
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

const ChannelCheckmark = styled.span`
  position: absolute;
  top: 0;
  left: 0;
  height: 20px;
  width: 20px;
  border-radius: 5px;
  background: linear-gradient(
          250deg,
          var(--magenta) 10%,
          var(--light-blue) 90%
  );
  color: #ffffff;
`

const ChannelLabel = styled.label`
  display: flex;
  align-items: center;
  position: relative;
  margin-bottom: 5px;
  cursor: pointer;
  ${text14Medium};
`

const ChannelName = styled.span`
  margin-left: 8px;
  text-wrap: nowrap;
`

const DownloadButton = styled(Button)`
  width: 140px;
  background: transparent;
  border: none;
  text-decoration: underline;
  ${text14Medium}
`
