import { SUBWALLET_JS, VOTING_CONTRACT_ADDRESS } from "./../../Constant";
import toaster from "../../Components/Common/Toast";
import { connectmetamask } from "./user.action";
import { useDispatch } from "react-redux";
import { Dispatch } from "redux";
import {
  callGetMethod,
  callSendMethod,
  createInstance,
} from "../../Services/contract.web3Service";
import { getError } from "../../Services/common.service";
import { WsProvider } from "@polkadot/rpc-provider";
import { ApiPromise } from "@polkadot/api";
import { web3Enable } from "@polkadot/extension-dapp";
import { Abi, ContractPromise } from "@polkadot/api-contract";
import { RPC_URL_ASTAR } from "../../Constant";
import voteABI from "../../Abi/voting.json";
import { errorCheck } from "../../Services/Helpers/errorServices";
import { TXN_ERROR } from "../../Constants/AlertMessages/ErrorMessages";
import { setTransactionHashForArbitorVote } from "../../Redux/userData/userData";
import store from "../../Redux/store";
/**CALL COONTRACT'S GET METHODS */
export const callContractGetMethod = (
  method: string,
  data: any = [],
  contractType: string,
  loading = true,
  dynamicAddress: string = "",
  showError: boolean = true
) => {
  return async (dispatch: Dispatch<any> = useDispatch()) => {
    try {
      /**SHOW LOADING */
      // if (loading) store?.dispatch(loader(true));

      /**CALL GET METHOD */
      const result = await callGetMethod(
        method,
        data,
        contractType,
        dynamicAddress
      );
      // if (loading) dispatch(loader(false));
      return result;
    } catch (error) {
      // if (loading) dispatch(loader(false));
      return showError ? toaster.error(getError(error)) : null;
    }
  };
};

/**CALL CONTRACT'S SEND METHODS */
export function callContractSendMethod(
  method: string,
  data: any = [],
  walletAddress: string,
  contractType: string,
  value: string = "",
  dynamicAddress: string = ""
) {
  return async (dispatch: Dispatch<any> = useDispatch(), getState: any) => {
    try {
      let wallet = getState().user.wallet;
      let verifyAccount: any = false;

      /**VALIDATE WALLET */
      if (wallet === "MetaMask") {
        verifyAccount = await dispatch(connectmetamask());
      }
      if (wallet !== "MetaMask" || (wallet === "MetaMask" && verifyAccount)) {
        /**SHOW LOADING */
        // dispatch(loader(true));

        /**CREATE INSTANCE WITH WALLET */
        const contractInstance = await createInstance();
        if (contractInstance) {
          /**CALL SEND METHOD */
          const result = await callSendMethod(
            method,
            data,
            walletAddress,
            contractType,
            value,
            dynamicAddress
          );
          // dispatch(loader(false));
          return result;
        } else {
          /**IF ANY ERROR IN CREATING INSTANCE */
          // dispatch(loader(false));
          return toaster.error(
            "Some error occurred during contract interaction. Please reload the page."
          );
        }
      }
    } catch (error) {
      // dispatch(loader(false));
      return toaster.error(getError(error));
    }
  };
}

//Arbiters vote for all cases: no discrepancies, minor discrepancies, moderate discrepancies, and reject.

export const voteArbiters = async (
  voterId: number,
  votingType: string,
  WalletAddress: any
) => {
  return new Promise(async (resolve, reject) => {
    try {
      // Contract call setup and execution code
      const provider = new WsProvider(RPC_URL_ASTAR);
      const api = new ApiPromise(({ provider }));
      const allInjected = await web3Enable(SUBWALLET_JS);
      await api.isReady;

      // Set signer
      api.setSigner(allInjected[0].signer);

      // Define ABI
      const abi = new Abi(voteABI, api.registry.getChainProperties());

      // Initialise the contract for escrow
      const contract: any = new ContractPromise(
        api,
        abi,
        VOTING_CONTRACT_ADDRESS
      );

      // Calculate gas limit
      const gasLimit: any = api.registry.createType(
        "WeightV2",
        api.consts.system.blockWeights["maxBlock"]
      );

      // Query gas requirements
      const { gasRequired } = await contract?.query?.vote(
        WalletAddress,
        {
          gasLimit: gasLimit,
        },
        voterId,
        votingType
      );
      let transactionHash: any; // Declare a variable to store the transaction hash
      let finalVoteEvent: any;
      // Send transaction
      await contract?.tx
        ?.vote({ gasLimit: gasRequired }, voterId, votingType)
        .signAndSend(WalletAddress, (res: any) => {
          if (res?.status?.isInBlock) {
            store.dispatch(
              setTransactionHashForArbitorVote(
                (transactionHash = res?.status?.asInBlock.toHex())
              )
            );
            // Store the transaction hash
          }
          if (res?.status.isFinalized === true) {
            finalVoteEvent = res;
            if (res?.contractEvents && res.contractEvents.length > 0) {
              finalVoteEvent = res.contractEvents;
            } else {
              finalVoteEvent = "No events found";
            }
            // toaster.success("Transaction successfully completed");
            resolve({ transactionHash, finalVoteEvent });
          }
        });
    } catch (error) {
      errorCheck(error);
      reject(TXN_ERROR);
    }
  });
};
