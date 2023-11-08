export const API_HOST = "http://10.1.4.54:9000/api/v1";
export const CHAIN_ID = "97";
export const RPC_URL = "https://data-seed-prebsc-1-s1.binance.org:8545";
export const NETWORK_NAME = "BSC Testnet";
export const NETWORK_SYMBOL = "bsc";
export const NETWORK_DECIMALS = 18;
export const EXPLORAR_LINK = "https://testnet.bscscan.com";
export const USDT_ADDRESS = "0xac62424c3d7A06ED1065d73102e9805d6B670ad5";
export const TOKEN_ADDRESS = "0x93aa5b199127887BD0099B7E0A97648b20D0d450";

//Astar DATA
export const RPC_URL_ASTAR = "wss://rpc.shibuya.astar.network";
export const CONTRACT_ADDRESS_BID_TOKEN =
  "XMSDdX4K5eBnGFwzwNv2eaUtQwG2SGVvmuC9UhK7MasGMS8";
export const CONTRACT_ADDRESS_ESCROW =
  "XQ3Bt4gf3YdjsG1Y3HLZjBDovVRQoN3peQHhzyMBidrSJW3";
export const VOTING_CONTRACT_ADDRESS =
  "ZK4a9MJ9BdZ5dQdwjbNVpSjosFsv6SDEbCtvhh9DAqJvuCX";
export const ARBITER_ADDRESS =
  "ZK4a9MJ9BdZ5dQdwjbNVpSjosFsv6SDEbCtvhh9DAqJvuCX";
export const BID_TOKEN_DECIMAL = 18;
export const PLATFORM_FEE_PERCENTAGE = 5;
export const SUBWALLET = "Subwallet";
export const SUBWALLET_JS = "subwallet-js";
export const POLKADOT_JS = "polkadot-js";
export const PATRON = "patron";
export const AUDITOR = "auditor";
export const PENDING = "PENDING";
export const IN_PROGRESS = "IN_PROGRESS";
export const CONFIRM = "CONFIRM";
export const COMPLETED = "COMPLETED";
export const SUBMITTED = "SUBMITTED";
export const UNDER_ARBITERATION  = "UNDER_ARBITERATION";
export const FAILED = "FAILED";
export const SUCCESS = "SUCCESS";
export const SUCCESS_TXN = "success";
export const ERROR_TXN = "error";
export const PENDING_TXN = "Pending";
export const TRANSACTION_PROCESS = "Transaction is in process...";
export const TRANSACTION_SUCCESS = "Transaction Successful";

//URL
export const baseUrl = "http://10.1.4.54:9000/uploaded/images/";
export const baseUrlReport = "http://10.1.4.54:9000/uploaded/submits/";
export const SHIBUYA_BASE_URL = "https://shibuya.subscan.io/block";
export const isImageFile = (url: any) => {
  return url.endsWith(".png") || url.endsWith(".jpeg") || url.endsWith(".jpg");
};

//APIURL
export const APIURL = {
  USER_LOGIN: "/login",
  USER_REGISTER: "/register",
  CONFIRM_POST: "/confirmPost",
  UPDATE_PROFILE: "/updateProfile",
  UPDATE_CLAIM: "/updateAuditStatusAfterClaim",
  UPDATE_AUDIT_STATUS: "/updateAuditStatus",
  UPDATE_BID_STATUS: "/updateBidStatus",
  UPDATE_AUDITOR_ID: "/updateAuditorID",
  UPDATE_SALT: "/updateSalt",
  REGISTER_AUDIT: "/registerAudit",
  GET_USER_INFO: "/getUserInfo",
  CONFIRM_SUBMIT_AUDIT: "/confirmSubmit",
  GET_DETAILS_OF_ALL_AUDITS: "/getDetailsOfAllAudits",
  UPDATE_PASSWORD: "/updatePassword",
  GET_DETAILS_OF_ALL_AUDITS_PUBLIC: "/getDetailsOfAllAuditsPublic",
  GET_DETAILS_OF_AUDIT: "/getDetailsOfAudit",
  BIDDING_REQUEST: "/requestForAudit",
  BIDS_OF_MY_REQUEST: "/getBidsOfMyRequest",
  TWO_FACTOR_AUTHANTICATION: "/twoFactorAuthentication",
  TWO_FACTOR_VERIFY: "/verifytwoFactorAuthentication",
  LOGIN_TWO_FACTOR_VERIFICATION: "/logintwoFactorAuthentication",
  CHECK_TWO_FACTOR_STATUS: "/gettwoFAStatus",
  LOGOUT: "/logout",
  DELETE_BIDDER_BID: "/deleteBidRequest",
  DISABLE_TWO_FACTOR: "/disableTwoFactorAuthentication",
  SUBMIT_AUDIT_REPORT: "/submitAuditReport",
  SET_EXTEND_TIMELINE_POST: "/setExtendTimelineData",
  EXTEND_TIMELINE_POST: "/extendTimeline",
  ARBITER_TABLE_LISTING: "/getArbitorSpecificPosts ",
  VIEW_POST_FOR_ARBITOR: "/viewArbiterationDetails",
  SELECT_ARBITORS: "/selectArbiters",
  ARBITER_VOTE: "/voteForPost",
  REMOVE_PROFILE_PICTURE: "/removeProfilePicture",
  TRANSACTION_HISTORY: "/transactionHistory",
  MY_BIDS: "/getDetailsOfMyAllbids",
  TRANSACTION_REGISTER: "/transactionRegister",
};