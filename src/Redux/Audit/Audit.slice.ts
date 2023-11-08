import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  submitAuditReport: {},
  submitAuditorReport:"",
  submitAuditSuccess:"",
  declineReportSuccess:"",
  transactionHashForPost:"",
};

/**AUDIT SLICE */
export const userSlice = createSlice({
  name: "Audit",
  initialState,

  reducers: {
    setAuditReport: (state, action) => {
      const { payload } = action;
      state.submitAuditReport = payload;
    },
    setAuditorReport: (state, action) => {
      const { payload } = action;
      state.submitAuditorReport = payload;
    },
    setSubmitAuditSuccess: (state, action) => {
      const { payload } = action;
      state.submitAuditSuccess = payload;
    },
    setDeclineReportSuccess: (state, action) => {
      const { payload } = action;
      state.declineReportSuccess = payload;
    },
    setTransactionHash: (state, action) => {
      const { payload } = action;
      state.transactionHashForPost = payload;
    },

  },
});

/**ACTIONS FOR SLICE*/
export const { setAuditReport ,setAuditorReport,setSubmitAuditSuccess,setDeclineReportSuccess,setTransactionHash} = userSlice.actions;

export default userSlice.reducer;
