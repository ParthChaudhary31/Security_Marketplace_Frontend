export interface ExtendedTimelineResponse {
    message: string,
    status: number,
    error: boolean,
    token: string,
    data: {
        emailAddress: string
        postId: string,
        reason: string,
        proposedAmount: any,
        proposedDeliveryTime:any,
        isAccepted:any,
    }
  }