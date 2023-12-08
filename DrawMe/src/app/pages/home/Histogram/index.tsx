import {
  ChangeEvent,
  MouseEvent,
  useCallback,
  useEffect,
  useState,
} from "react"

import { Helmet } from "react-helmet-async"
import styled from "styled-components"

import HistogramChart from "./HistogramChart"

import Button from "@/components/Button"
import EditWrapper from "@/components/EditWrapper"
import Input from "@/components/Input"
import Tooltip from "@/components/Tooltip"
import { useAppDispatch, useAppSelector } from "@/store"
import { setPixels } from "@/store/slices/image"
import { text16 } from "@/utils/fonts"
import findMinAndMax from "@/utils/functions/autocorrection/findMinAndMax"
import ignorePixelFraction from "@/utils/functions/autocorrection/ignorePixelFraction"
import { countSelectedChannels } from "@/utils/functions/countSelectedChannels"
import { spaces } from "@/utils/spaces"

export default function Histogram() {
  const dispatch = useAppDispatch()

  const { src: image, space, channels } = useAppSelector(({ image }) => image)

  const [leftCoef, setLeftCoef] = useState<number>(0)
  const [rightCoef, setRightCoef] = useState<number>(0)
  const [histograms, setHistograms] = useState<number[][]>([[], [], []])

  const getChannelData = useCallback(
    (channelNumber: number): number[] =>
      image?.pixels.filter((_, idx) => idx % 3 === channelNumber) ?? [],
    [image?.pixels]
  )

  const calculateHistogramData = useCallback(
    (channelNumber: number): number[] => {
      const histogramData: number[] = new Array(256).fill(0)
      const channelData = getChannelData(channelNumber)
      channelData.forEach(value => {
        histogramData[Math.round(value)] += 1
      })
      console.log(channelNumber, channelData, histogramData)

      return histogramData
    },
    [getChannelData]
  )

  const calculateAutocorrection = useCallback((): number[] => {
    if (!image?.pixels) return []
    const mins: number[] = []
    const maxs: number[] = []
    if (space[0].toLowerCase() === "y") {
      const limits = findMinAndMax(
        image.pixels.length / 3,
        histograms[0],
        leftCoef,
        rightCoef
      )
      mins.push(limits.min)
      maxs.push(limits.max)
    } else {
      histograms.forEach(histogramData => {
        if (histogramData.length !== 0) {
          const limits = findMinAndMax(
            image.pixels.length / 3,
            histogramData,
            leftCoef,
            rightCoef
          )
          mins.push(limits.min)
          maxs.push(limits.max)
        }
      })
    }

    const yMin = Math.min(...mins)
    const yMax = Math.max(...maxs)
    return ignorePixelFraction(image.pixels, yMin, yMax)
  }, [histograms, image?.pixels, leftCoef])

  const handleLeftChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setLeftCoef(+e.target.value)
  }

  const handleRightChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setRightCoef(+e.target.value)
  }

  const handleButtonClick = useCallback(
    (_: MouseEvent<HTMLButtonElement>): void => {
      if (image) {
        dispatch(
          setPixels({
            ...image,
            pixels: calculateAutocorrection(),
          })
        )
      }
    },
    [calculateAutocorrection, dispatch, image]
  )

  useEffect(() => {
    console.log(image?.pixels)
  }, [image?.pixels])

  useEffect(() => {
    const sum = countSelectedChannels(channels)
    const newHistograms: number[][] = [[], [], []]
    if (sum !== 2) {
      channels.forEach((channel, index) => {
        if (channel) {
          newHistograms[index] = calculateHistogramData(index)
        }
      })
    }
    setHistograms(newHistograms)
  }, [calculateHistogramData, channels])

  return (
    <>
      <Helmet>
        <title>Гистограмма</title>
      </Helmet>

      <StyledEditWrapper>
        <Column>
          <Row>
            <Tooltip>
              <span>
                Вы можете игнорировать некоторое количество самых тёмных точек
                (слева) и самых ярких точек (справа). Значения должны находиться
                в диапазоне от 0 до 0.5.
              </span>
            </Tooltip>
            <span>Доля игнорируемых пикселей</span>
          </Row>
          <Row>
            <CorrectionControlPanel>
              <CorrectionControl>
                <span>Слева:</span>
                <Input
                  placeholder="0"
                  type="number"
                  width={100}
                  value={leftCoef}
                  onChange={handleLeftChange}
                />
                <span>Справа:</span>
                <Input
                  placeholder="0"
                  type="number"
                  width={100}
                  value={rightCoef}
                  onChange={handleRightChange}
                />
              </CorrectionControl>
            </CorrectionControlPanel>
          </Row>
        </Column>
        <Column>
          <Button
            data-type="primary"
            disabled={false}
            onClick={handleButtonClick}
          >
            Скорректировать
          </Button>
        </Column>
      </StyledEditWrapper>

      <HistogramSidebar>
        {spaces[space].channels.map((channelName, index) => {
          return (
            <HistogramChart
              key={channelName}
              channelLabel={`Канал ${channelName}:`}
              data={histograms[index]}
            />
          )
        })}
      </HistogramSidebar>
    </>
  )
}

const StyledEditWrapper = styled(EditWrapper)`
  display: flex;
  gap: 16px;
  padding: 20px 24px;

  ${text16}
`

const Column = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 10px;
`

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`

const CorrectionControlPanel = styled.div`
  display: flex;
  gap: 12px;
`

const CorrectionControl = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;

  > ${Input} {
    width: 70px;
  }
`

const HistogramSidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  position: fixed;
  top: 50%;
  right: 20px;
  transform: translateY(-50%);
  padding: 20px;
  background: white;
  border-radius: 25px;
`
