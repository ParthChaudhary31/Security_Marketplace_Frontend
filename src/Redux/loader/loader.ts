import { createSlice } from "@reduxjs/toolkit";
import { LoaderData } from "../../Constants/Interfaces/Authentication/LoaderData";

//IntialState Loader Slice
const initialState: LoaderData = {
  isLoading: false,
};

// LoaderData SLICE
export const loaderSlice = createSlice({
  name: "loader",
  initialState,
  reducers: {
    resetLoaderDataSlice: (state, action) => {
      state.isLoading = false;
    },
    setIsLoding: (state, action) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setIsLoding,resetLoaderDataSlice } = loaderSlice.actions;
export default loaderSlice.reducer;
