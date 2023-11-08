export interface AuditDetailsPostResponse {
  message: string;
  status: number;
  error: boolean;
  token: string;
  data: {
    U_Id:string;
    emailAddress: string;
    firstName: string;
    lastName: string;
    gitHub: string;
    auditType: string;
    offerAmount: string;
    estimatedDelivery: string;
    description: string;
    socialLink: string;
    text: string;
    paymentStatus: string;
    Timeline: string;
    Amount: string;
    url: string;    
  };
}
