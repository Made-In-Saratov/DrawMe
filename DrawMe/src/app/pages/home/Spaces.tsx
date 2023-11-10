import { useCallback } from "react"

import { Helmet } from "react-helmet-async"
import styled from "styled-components"

import Button from "@/components/Button"
import Checkbox from "@/components/Checkbox"
import Dropdown from "@/components/Dropdown"
import EditWrapper from "@/components/EditWrapper"
import { useAppDispatch, useAppSelector } from "@/store"
import { setChannels, setSpace } from "@/store/slices/image"
import { SpacesT } from "@/store/slices/image/types"
import { text14, text14Medium } from "@/utils/fonts"
import useImageSave from "@/utils/hooks/useImageSave"
import useImageUpload from "@/utils/hooks/useImageUpload"
import { spaces } from "@/utils/spaces"

export default function Spaces() {
  const dispatch = useAppDispatch()

  const { space, channels, src: image } = useAppSelector(({ image }) => image)

  const { inputProps, handleClick, isLoading, error } = useImageUpload()

  const handleSaveClick = useImageSave()

  const getCheckboxClickHandler = useCallback(
    (index: number) => () => {
      const channelsCopy = [...channels] as [boolean, boolean, boolean]
      channelsCopy[index] = !channelsCopy[index]
      dispatch(setChannels(channelsCopy))
    },
    [channels, dispatch]
  )

  const handleItemChange = useCallback(
    (item: string) => {
      for (const [key, value] of Object.entries(spaces))
        if (value.name === item) {
          dispatch(setSpace(key as SpacesT))
          break
        }
    },
    [dispatch]
  )

  const isDownloadDisabled = !image

  return (
    <>
      <Helmet>
        <title>Изменение цветового пространства</title>
      </Helmet>

      <StyledEditWrapper>
        <Column>
          <Dropdown
            items={Object.values(spaces).map(({ name }) => name)}
            activeItem={spaces[space].name}
            setActiveItem={handleItemChange}
          />
          <DownloadButton onClick={handleClick}>
            {isLoading ? "Загрузка..." : error ? "Ошибка" : "Загрузить другое"}
            <input {...inputProps} />
          </DownloadButton>
        </Column>

        <Column>
          <ChannelsList>
            {spaces[space].channels.map((channelName, index) => (
              <StyledCheckbox
                key={channelName}
                checked={channels[index]}
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
