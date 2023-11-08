import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  twoFaSecretKey: {},
  twoFaStatus: false,
};

/**USER DETAILS SLICE */
export const userSlice = createSlice({
  initialState,
  name: "twofactor",

  reducers: {
    setTwoFactor: (state, action) => {
      const { payload } = action;
      state.twoFaSecretKey = payload;
    },

    setTwoFactorStatus: (state, action) => {
      const { payload } = action;
      state.twoFaStatus = payload;
    },

    reset: () => initialState,
  },
});

/**ACTIONS FOR SLICE*/
export const { setTwoFactor, setTwoFactorStatus, reset } = userSlice.actions;

export default userSlice.reducer;
