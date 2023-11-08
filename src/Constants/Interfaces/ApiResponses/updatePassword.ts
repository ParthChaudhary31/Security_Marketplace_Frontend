export interface updatePasswordResponse {
  message: string;
  status: number;
  error: boolean;
  token: string;
  response: {
    emailAddress: string;
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
  };
}
