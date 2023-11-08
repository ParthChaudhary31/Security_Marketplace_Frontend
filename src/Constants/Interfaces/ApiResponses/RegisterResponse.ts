export interface RegisterResponse {
    message: string,
    status: number,
    error: boolean,
    token: string,
    data: {
        emailAddress: string
        firstName: string,
        lastName: string,
    }
  }