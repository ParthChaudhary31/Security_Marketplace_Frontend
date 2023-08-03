export interface AuthenticationData {
  walletAddress: string;
  walletType: string;
  chainId: string;
  userWalletChainId: string;
  jwtToken: string;
  isLoggedIn: boolean;
  isWalletConnected:boolean;
}
