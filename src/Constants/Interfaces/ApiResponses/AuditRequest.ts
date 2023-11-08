export interface AuditResponse {
  message: string;
  status: number;
  error: boolean;
  token: string;
  data: {
    firstName: string;
    lastName: string;
  }
  response: {
    auditType: ['']
    auditorEmail: string
    createdAt: string
    description: string
    emailAddress: string
    estimatedDelivery: string
    gitHub: string
    offerAmount: number
    postID: number
    socialLink: string
    status: string
    updatedAt: string
    _id: string
  };
}
