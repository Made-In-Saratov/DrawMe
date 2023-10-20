import { PayloadAction, createSlice } from "@reduxjs/toolkit"

import { IImage, IImageSlice, SpacesT } from "@/store/slices/image/types"
import { spaces } from "@/utils/spaces"

const initialState: IImageSlice = {
  src: null,

  space: "RGB",
  channels: [true, true, true],
  gamma: 0,
}

/* eslint-disable no-param-reassign */
const imageSlice = createSlice({
  name: "image",
  initialState,
  reducers: {
    setImage: (state, { payload }: PayloadAction<IImage>) => {
      state.src = payload

      state.gamma = 0
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

    setGamma(state, { payload }: PayloadAction<number>) {
      state.gamma = payload
    },
  },
})

export const { setImage, setSpace, setChannels, setGamma } = imageSlice.actions

export default imageSlice.reducer
