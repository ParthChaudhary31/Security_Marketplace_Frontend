import { createSlice } from "@reduxjs/toolkit";
import { UserData } from "../../Constants/Interfaces/Authentication/UserData";

// InitialState for userData Slice
const initialState: UserData = {
  name: "",
  firstName: "",
  lastName: "",
  emailAddress: "",
  gitHub: "",
  linkedIn: "",
  telegram: "",
  bio: "",
  xp: 0,
  profilePicture: "",
};

// UserData SLICE
export const userDataSlice = createSlice({
  name: "userData",
  initialState,
  reducers: {
    resetAuthenticationDataSlice: (state, action) => {
      state.firstName = "";
      state.lastName = "";
      state.emailAddress = "";
      state.gitHub = "";
      state.linkedIn = "";
      state.telegram = "";
      state.bio = "";
      state.xp = 0;
      state.profilePicture = "";
    },
    setFirstName: (state, action) => {
      state.firstName = action.payload;
    },
    setlastName: (state, action) => {
      state.lastName = action.payload;
    },
    setEmailAddress: (state, action) => {
      state.emailAddress = action.payload;
    },
    setGitHub: (state, action) => {
      state.gitHub = action.payload;
    },
    setLinkdIn: (state, action) => {
      state.linkedIn = action.payload;
    },
    setTelegram: (state, action) => {
      state.telegram = action.payload;
    },
    setBio: (state, action) => {
      state.bio = action.payload;
    },
    setXp: (state, action) => {
      state.xp = action.payload;
    },
    setProfilePicture: (state, action) => {
      state.profilePicture = action.payload;
    },
  },
});

export const {
  resetAuthenticationDataSlice,
  setFirstName,
  setlastName,
  setEmailAddress,
  setGitHub,
  setLinkdIn,
  setTelegram,
  setBio,
  setXp,
  setProfilePicture,
} = userDataSlice.actions;
export default userDataSlice.reducer;
