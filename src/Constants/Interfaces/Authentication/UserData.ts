export interface UserData {
  upload: any;
  name: any;
  firstName: string;
  lastName: string;
  emailAddress: string;
  gitHub: string;
  linkedIn: string;
  telegram: string;
  bio: string;
  xp: number;
  profilePicture: any;
  userBalance: any;
  userActiveTab:{
    type:string;
    eventNumber:string;
  };
  userPageNumber: number;
  userDashboardTab:string;
  userProfileNumber:string;
  transactionHashForExtendedForAuditor:string;
  transactionHashForExtendedForPatron:string;
  transactionHashForSubmitReport:string;
  transactionHashForSubmitReportDecline:string;
  transactionHashForSubmitReportByPatron:string;
  transactionHashForCreatePost:string;
  transactionHashForAcceptBid:string;
  transactionHashForAcceptAudit:string;
  transactionHashForClaimAmount:string;
  transactionHashForArbitorVote:string;
  statusExtendedForAuditor:boolean;
  statusExtendedForPatron:boolean;
  paginationForBalance:any;
  paginationForBidTable:any;

}