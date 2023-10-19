import { PayloadAction, createSlice } from "@reduxjs/toolkit"

import { IImage, IImageSlice } from "@/store/slices/image/types"

const initialState: IImageSlice = {
  src: null,

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

    setGamma(state, { payload }: PayloadAction<number>) {
      state.gamma = payload
    },
  },
})

export const { setImage, setGamma } = imageSlice.actions

export default imageSlice.reducer
