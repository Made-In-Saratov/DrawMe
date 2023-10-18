import { PayloadAction, createSlice } from "@reduxjs/toolkit"

import { IImage } from "@/store/slices/image/types"

const initialState: IImage = {
  pixels: [],
  width: 0,
  height: 0,
  maxColorValue: 0,
  isP6: false,

  gamma: 0,
}

/* eslint-disable no-param-reassign */
const imageSlice = createSlice({
  name: "image",
  initialState,
  reducers: {
    setImage: (state, { payload }: PayloadAction<IImage>) => {
      state.pixels = payload.pixels
      state.width = payload.width
      state.height = payload.height
      state.maxColorValue = payload.maxColorValue
      state.isP6 = payload.isP6

      state.gamma = payload.gamma
    },
  },
})

export const { setImage } = imageSlice.actions

export default imageSlice.reducer
