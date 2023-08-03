export interface LoginResponse {
  message: string,
  status: number,
  error: boolean,
  token: string,
  data: {
      _id: string,
      emailAddress: string
      firstName: string,
      lastName: string,
      gitHub:any,
      linkedIn: any,
      telegram: any,
      bio: any,
      xp: number,
      profilePicture: any,
      password: string,
      createdAt: string,
      updatedAt: string,
      walletAddress:string
  }
}