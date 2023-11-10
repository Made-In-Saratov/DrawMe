import { PayloadAction, createSlice } from "@reduxjs/toolkit"

import { IImage, IImageSlice, SpacesT } from "@/store/slices/image/types"
import { spaces } from "@/utils/spaces"

const initialState: IImageSlice = {
  src: null,

  space: "RGB",
  channels: [true, true, true],
  gamma: 0,
  convertedGamma: 0,
}

/* eslint-disable no-param-reassign */
const imageSlice = createSlice({
  name: "image",
  initialState,
  reducers: {
    setImage: (state, { payload }: PayloadAction<IImage>) => {
      state.src = payload

      state.gamma = 0
      state.convertedGamma = 0
    },

    setPixels: (
      state,
      {
        payload,
      }: PayloadAction<{
        pixels: number[]
        width: number
        height: number
        isP6?: boolean
      }>
    ) => {
      if (state.src) {
        state.src.pixels = payload.pixels
        state.src.width = payload.width
        state.src.height = payload.height
        state.src.isP6 = payload.isP6 ?? state.src.isP6
      } else {
        state.src = {
          pixels: payload.pixels,
          width: payload.width,
          height: payload.height,
          maxColorValue: 255,
          isP6: payload.isP6 ?? true,
        }
      }
    },

    setSpace: (state, { payload }: PayloadAction<SpacesT>) => {
      if (state.src) {
        const currentSpaceDetails = spaces[state.space]
        const newSpaceDetails = spaces[payload]

        const pixels = state.src.pixels

        const newPixels: number[] = []
        for (let i = 0; i < pixels.length; i += 3)
          // convert to rgb and then to new space
          newPixels.push(
            ...newSpaceDetails.converter(
              currentSpaceDetails.reverseConverter([
                pixels[i],
                pixels[i + 1],
                pixels[i + 2],
              ])
            )
          )

        state.src.pixels = newPixels
        state.src.isP6 = true
      }

      state.space = payload
    },

    setChannels: (
      state,
      { payload }: PayloadAction<[boolean, boolean, boolean]>
    ) => {
      state.channels = payload
    },

    setGamma(
      state,
      { payload }: PayloadAction<{ gamma: number; convertedGamma: number }>
    ) {
      state.gamma = payload.gamma
      state.convertedGamma = payload.convertedGamma
    },
  },
})

export const { setImage, setPixels, setSpace, setChannels, setGamma } =
  imageSlice.actions

export default imageSlice.reducer
