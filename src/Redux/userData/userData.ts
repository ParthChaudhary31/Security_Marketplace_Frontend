import { createSlice } from "@reduxjs/toolkit";
import { UserData } from "../../Constants/Interfaces/Authentication/UserData";

// InitialState for userData
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
  upload: "",
  userBalance:"",
  userActiveTab:{
    type:"",
    eventNumber:"first"
  },
  userPageNumber:1,
  userDashboardTab:"",
  userProfileNumber:"",
  transactionHashForExtendedForAuditor:"",
  transactionHashForExtendedForPatron:"",
  transactionHashForSubmitReport:"",
  transactionHashForSubmitReportDecline:"",
  transactionHashForSubmitReportByPatron:"",
  transactionHashForCreatePost:"",
  transactionHashForAcceptBid:"",
  transactionHashForAcceptAudit:"",
  transactionHashForClaimAmount:"",
  transactionHashForArbitorVote:"",
  statusExtendedForAuditor:false,
  statusExtendedForPatron:false,
  paginationForBalance:"",
  paginationForBidTable:"",
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
      state.userBalance = "";
      state.userActiveTab={
        type:"",
        eventNumber:"first",
      };
      state.userPageNumber=1;
      state.userDashboardTab="";
      state.userProfileNumber="";
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
    setUserBalance: (state, action) => {
      state.userBalance = action.payload;
    },
    setUserActiveTab: (state, action) => {
      state.userActiveTab = action.payload;
    },
    setUserPageNumber: (state, action) => {
      state.userPageNumber = action.payload;
    },
    setUserDashboardTab: (state, action) => {
      state.userDashboardTab = action.payload;
    },
    setUserProfileNumber: (state, action) => {
      state.userProfileNumber = action.payload;
    },
    setTransactionHashForExtendedForAuditor: (state, action) => {
      const { payload } = action;
      state.transactionHashForExtendedForAuditor = payload;
    },
    setTransactionHashForExtendedForPatron: (state, action) => {
      const { payload } = action;
      state.transactionHashForExtendedForPatron = payload;
    },
    setTransactionHashForSubmitReport: (state, action) => {
      const { payload } = action;
      state.transactionHashForSubmitReport = payload;
    },
    setTransactionHashForSubmitReportDecline: (state, action) => {
      const { payload } = action;
      state.transactionHashForSubmitReportDecline = payload;
    },
    setTransactionHashForSubmitReportByPatron: (state, action) => {
      const { payload } = action;
      state.transactionHashForSubmitReportByPatron = payload;
    },
    setTransactionHashForCreatePost: (state, action) => {
      const { payload } = action;
      state.transactionHashForCreatePost = payload;
    },
    setTransactionHashForAcceptBid: (state, action) => {
      const { payload } = action;
      state.transactionHashForAcceptBid = payload;
    },
    setTransactionHashForAcceptAudit: (state, action) => {
      const { payload } = action;
      state.transactionHashForAcceptAudit = payload;
    },
    setTransactionHashForClaimAmount: (state, action) => {
      const { payload } = action;
      state.transactionHashForClaimAmount = payload;
    },
    setTransactionHashForArbitorVote: (state, action) => {
      const { payload } = action;
      state.transactionHashForArbitorVote = payload;
    },
    setStatusExtendedForAuditor: (state, action) => {
      const { payload } = action;
      state.statusExtendedForAuditor = payload;
    },
    setStatusExtendedForPatron: (state, action) => {
      const { payload } = action;
      state.statusExtendedForPatron = payload;
    },
    setPaginationForBalance: (state, action) => {
      const { payload } = action;
      state.paginationForBalance = payload;
    },
    setPaginationForBidTable: (state, action) => {
      const { payload } = action;
      state.paginationForBidTable = payload;
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
  setUserBalance,
  setUserActiveTab,
  setUserPageNumber,
  setUserDashboardTab,
  setUserProfileNumber,
  setTransactionHashForExtendedForAuditor,
  setTransactionHashForExtendedForPatron,
  setTransactionHashForSubmitReport,
  setTransactionHashForSubmitReportDecline,
  setTransactionHashForSubmitReportByPatron,
  setTransactionHashForCreatePost,
  setTransactionHashForAcceptBid,
  setTransactionHashForAcceptAudit,
  setTransactionHashForClaimAmount,
  setTransactionHashForArbitorVote,
  setStatusExtendedForAuditor,
  setStatusExtendedForPatron,
  setPaginationForBalance,
  setPaginationForBidTable,
} = userDataSlice.actions;
export default userDataSlice.reducer;
