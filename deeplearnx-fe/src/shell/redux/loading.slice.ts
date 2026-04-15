import { createSlice } from "@reduxjs/toolkit";

const loadingSlice = createSlice({
  name: "loading",
  initialState: {
    totalLoadingProcess: 0,
  },
  reducers: {
    startLoading: (state) => {
      state.totalLoadingProcess++;
    },
    stopLoading: (state) => {
      state.totalLoadingProcess--;
      if (state.totalLoadingProcess <= 0) {
        state.totalLoadingProcess = 0;
      }
    },
  },
});

export const { startLoading, stopLoading } = loadingSlice.actions;
export default loadingSlice.reducer;
