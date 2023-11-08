import { createSlice } from "@reduxjs/toolkit";
import { AuthenticationData } from "../../Constants/Interfaces/Authentication/AuthenticationData";

// initialState for walletData
const initialState: AuthenticationData = {
  walletAddress: "",
  walletType: "",
  chainId: "",
  userWalletChainId: "",
  jwtToken: "",
  isLoggedIn: false,
  isWalletConnected:false,
  errorMessage: "",
  patronAccepted:false
};

// walletData SLICE
export const authenticationDataSlice = createSlice({
  name: "authenticationData",
  initialState,
  reducers: {
    resetUserDataSlice: (state, action) => {
      state.walletAddress = "";
      state.walletType = "";
      state.chainId = "";
      state.userWalletChainId = "";
      state.jwtToken = "";
      state.isLoggedIn = false;
      state.isWalletConnected = false;
    },
    setWalletAddress: (state, action) => {
      state.walletAddress = action.payload;
    },
    setWalletType: (state, action) => {
      state.walletType = action.payload;
    },
    setChainId: (state, action) => {
      state.chainId = action.payload;
    },
    setUserWalletChainId: (state, action) => {
      state.userWalletChainId = action.payload;
    },
    setJwtToken: (state, action) => {
      state.jwtToken = action.payload;
    },
    setIsLoggedIn: (state, action) => {
      state.isLoggedIn = action.payload;
    },
    setIsWalletConnected: (state, action) => {
      state.isWalletConnected = action.payload;
    },
    setErrorMessage: (state, action) => {
      state.errorMessage = action.payload;
    },
    setPatronAccepted: (state, action) => {
      state.patronAccepted = action.payload;
    },
  },
});

export const {
  resetUserDataSlice,
  setWalletAddress,
  setWalletType,
  setChainId,
  setUserWalletChainId,
  setJwtToken,
  setIsLoggedIn,
  setIsWalletConnected,
  setErrorMessage,
  setPatronAccepted,
} = authenticationDataSlice.actions;
export default authenticationDataSlice.reducer;

