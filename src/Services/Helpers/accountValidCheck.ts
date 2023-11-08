import { decodeAddress, encodeAddress } from "@polkadot/keyring";
import { hexToU8a, isHex } from "@polkadot/util";
import { getPaymentInfo, userNativeTokenBalance } from "../contract.service";
import { remove18DecimalComma } from "./mathhelper";


export const isValidAddressPolkadotAddress = (address) => {
  try {
    encodeAddress(isHex(address) ? hexToU8a(address) : decodeAddress(address));

    return true;
  } catch (error) {
    return false;
  }
};

  //user balance check
 export const userBalanceCheck = async (WalletAddress: any) => {
    const userWalletBalance:any = await userNativeTokenBalance(WalletAddress);
    const userWalletBalanceReadable: any = userWalletBalance?.toHuman();
    const ContractUserValue: any = (userWalletBalanceReadable?.Ok);
    const userDecimalValue = BigInt(ContractUserValue.replace(/,/g, '').replace(/^0+/, ''))
    let simpleNumberValue = (userDecimalValue).toString();
    simpleNumberValue = simpleNumberValue.replace("n", "");
    return simpleNumberValue;
  }

  // balance check validation
  export const validateEscrowBalance = async (currentAuditId: any,WalletAddress: any,amount:Number) => {
    const result :any = await getPaymentInfo( WalletAddress , currentAuditId);
    const escrowValue :Number = await remove18DecimalComma(result?.toHuman()?.Ok?.value)
    const userBal :any = await userBalanceCheck(WalletAddress);
    if(amount <= escrowValue ){
      return true
    }else if(amount > escrowValue){
      const differenceBal :Number = Number(amount) - Number(escrowValue) ;
      if(userBal > differenceBal) {
        return true
      }else{
        return false
    }
    }
  }