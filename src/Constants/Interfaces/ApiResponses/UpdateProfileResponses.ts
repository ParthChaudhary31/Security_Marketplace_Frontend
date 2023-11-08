export interface updateProfileResponse {
    message: string,
    status: number,
    error: boolean,
    token: string,
    data: {
        emailAddress: string,
        walletAddress: string,
        firstName: string,
        lastName: string,
        gitHub: any,
        linkedIn: any,
        telegram: any,
        bio: any,
        profilePicture: any,
    }
  }