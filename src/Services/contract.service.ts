import {
  RPC_URL_ASTAR,
  CONTRACT_ADDRESS_BID_TOKEN,
  CONTRACT_ADDRESS_ESCROW,
  SUBWALLET_JS,
  VOTING_CONTRACT_ADDRESS,
} from "../Constant";
import { WsProvider } from "@polkadot/rpc-provider";
import { ApiPromise } from "@polkadot/api";
import { web3Enable } from "@polkadot/extension-dapp";
import { options } from "@astar-network/astar-api";
import { Abi, ContractPromise } from "@polkadot/api-contract";
import TokenABI from "../Abi/bidToken.json";
import EscrowABI from "../Abi/EscrowContract.json";
import {
  DateInToMilliEpoch,
  currentMilliEpoch,
  valueInToTokenDecimal,
} from "./Helpers/mathhelper";
import { errorCheck } from "./Helpers/errorServices";
import store from "../../src/Redux/store";
import {
  setTransactionHashForAcceptBid,
  setTransactionHashForClaimAmount,
  setTransactionHashForCreatePost,
  setTransactionHashForExtendedForAuditor,
  setTransactionHashForExtendedForPatron,
  setTransactionHashForSubmitReport,
  setTransactionHashForSubmitReportByPatron,
  setTransactionHashForSubmitReportDecline,
} from "../Redux/userData/userData";
import { TXN_ERROR } from "../Constants/AlertMessages/ErrorMessages";

//astarWalletBalance
export const astarWalletBalance = async (walletAddress: any) => {
  const wsProvider = new WsProvider(RPC_URL_ASTAR);
  const api = await ApiPromise.create({ provider: wsProvider });
  try {
    const accountInfo: any = await api.query.system.account(walletAddress);
    const userBalance: any = accountInfo.toHuman().data?.free;
    const userDecimalValue = BigInt(
      userBalance.replace(/,/g, "").replace(/^0+/, "")
    );
    let simpleNumberValue = userDecimalValue.toString();
    simpleNumberValue = simpleNumberValue.replace("n", "");
    return simpleNumberValue;
  } catch (error: any) {
    console.error("Error fetching account information:", error?.message);
  } finally {
    // Make sure to disconnect from the API when done
    await api.disconnect();
  }
};

//TotalSupply
export const nativeTokenTotalSupply = async (userAddress: any) => {
  const provider = new WsProvider(RPC_URL_ASTAR);
  const api = new ApiPromise(options({ provider }));
  // initialise via static create
  await api.isReady;
  //contract call
  const abi = new Abi(TokenABI, api.registry.getChainProperties());
  // Initialise the contract class
  const contract = new ContractPromise(api, abi, CONTRACT_ADDRESS_BID_TOKEN);
  const gasLimit: any = api.registry.createType(
    "WeightV2",
    api.consts.system.blockWeights["maxBlock"]
  );

  //2 call ............ get balance of the user
  const { output } = await contract.query.totalSupply(userAddress, {
    gasLimit,
  });
  return output;
};

//userNativeTokenBalance Astar //
export const userNativeTokenBalance = async (userAddress: any) => {
  return new Promise(async (resolve, reject) => {
    try {
      const provider = new WsProvider(RPC_URL_ASTAR);
      const api = new ApiPromise(options({ provider }));
      // initialise via static create
      await api.isReady;
      //contract call
      const abi = new Abi(TokenABI, api.registry.getChainProperties());
      // Initialise the contract class
      const contract = new ContractPromise(
        api,
        abi,
        CONTRACT_ADDRESS_BID_TOKEN
      );
      const gasLimit: any = api.registry.createType(
        "WeightV2",
        api.consts.system.blockWeights["maxBlock"]
      );
      //2 call ............ get balance of the user
      const { output } = await contract.query.balanceOf(
        userAddress,
        {
          gasLimit,
        },
        userAddress
      );
      resolve(output);
    } catch (error) {
      console.log(error);
    }
  });
};

//TotalSupply
export const getPaymentInfo = async (userAddress: any, currentAuditId: any) => {
  try {
    const provider = new WsProvider(RPC_URL_ASTAR);
    const api = new ApiPromise(options({ provider }));
    // initialise via static create
    await api.isReady;
    //contract call
    const abi = new Abi(EscrowABI, api.registry.getChainProperties());
    // Initialise the contract class
    const contract = new ContractPromise(api, abi, CONTRACT_ADDRESS_ESCROW);
    const gasLimit: any = api.registry.createType(
      "WeightV2",
      api.consts.system.blockWeights["maxBlock"]
    );

    //2 call ............ get balance of the user
    const { output } = await contract.query.getPaymentinfo(
      userAddress,
      {
        gasLimit,
      },
      currentAuditId
    );
    return output;
  } catch (error) {
    console.log(error);
  }
};
//userNativeTokenAllowance Astar //
export const userNativeTokenAllowance = async (userAddress: any) => {
  return new Promise(async (resolve, reject) => {
    try {
      const provider = new WsProvider(RPC_URL_ASTAR);
      const api = new ApiPromise(options({ provider }));
      // initialise via static create
      await api.isReady;
      //contract call
      const abi = new Abi(TokenABI, api.registry.getChainProperties());
      // Initialise the contract class
      const contract = new ContractPromise(
        api,
        abi,
        CONTRACT_ADDRESS_BID_TOKEN
      );

      const gasLimit: any = api.registry.createType(
        "WeightV2",
        api.consts.system.blockWeights["maxBlock"]
      );

      //2 call ............ get allowance of the user
      const { output } = await contract.query.allowance(
        userAddress,
        {
          gasLimit,
        },
        userAddress,
        CONTRACT_ADDRESS_ESCROW
      );
      resolve(output);
    } catch (error) {
      console.log(error);
    }
  });
};

//// Approve Fn
export const userNativeTokenApproval = async (
  userAddress: any,
  amount: any,
  e: any
) => {
  return new Promise(async (resolve, reject) => {
    try {
      //contract call
      const provider = new WsProvider(RPC_URL_ASTAR);
      const api = new ApiPromise({ provider });
      // initialise via static create
      const allInjected = await web3Enable(SUBWALLET_JS);
      await api.isReady;
      //setsigner
      api.setSigner(allInjected[0].signer);
      //abi
      const abi = new Abi(TokenABI, api.registry.getChainProperties());
      // Initialise the contract for token
      const contract: any = new ContractPromise(
        api,
        abi,
        CONTRACT_ADDRESS_BID_TOKEN
      );
      //gas
      const gasLimit: any = api.registry.createType(
        "WeightV2",
        api.consts.system.blockWeights["maxBlock"]
      );
      //gasRequired
      const { gasRequired } = await contract.query.approve(
        userAddress,
        {
          gasLimit: gasLimit,
        },
        CONTRACT_ADDRESS_ESCROW,
        amount
      );
      //TX
      await contract.tx
        .approve({ gasLimit: gasRequired }, CONTRACT_ADDRESS_ESCROW, amount)
        .signAndSend(userAddress, (res: any) => {
          if (res?.status.isInBlock) {
          }
          if (res?.status.isFinalized) {
            if (res?.status.isFinalized === true) {
              resolve(res?.status.isFinalized);
            }
          }
        });
    } catch (error) {
      console.log(error);
      errorCheck(error);
      reject(TXN_ERROR);
    }
  });
};

//Audit request TXN///////////////////////
export const AuditPostTxn = async (data: any) => {
  return new Promise(async (resolve, reject) => {
    const salt: any = data?.salt;
    const userInputAmount: any = valueInToTokenDecimal(data?.offerAmount);
    const AuditEpoch = await DateInToMilliEpoch(data?.estimatedDelivery);
    const currentEpoch = await currentMilliEpoch();
    // //epoch difference
    const EpochTxn: any = AuditEpoch - currentEpoch;
    try {
      const provider = new WsProvider(RPC_URL_ASTAR);
      const api = new ApiPromise(options({ provider }));
      // initialise via static create
      const allInjected = await web3Enable(SUBWALLET_JS);
      await api.isReady;
      //setsigner
      api.setSigner(allInjected[0].signer);
      //abi
      const abi = new Abi(EscrowABI, api.registry.getChainProperties());
      // Initialise the contract class
      const contract: any = new ContractPromise(
        api,
        abi,
        CONTRACT_ADDRESS_ESCROW
      );
      // gas calculate
      const gasLimit: any = api.registry.createType(
        "WeightV2",
        api.consts.system.blockWeights["maxBlock"]
      );
      const { gasRequired } = await contract.query.createNewPayment(
        data?.userAddress,
        {
          gasLimit: gasLimit,
        },
        userInputAmount,
        VOTING_CONTRACT_ADDRESS,
        EpochTxn,
        salt
      );
      let transactionHash: any; // Declare a variable to store the transaction hash

      //TX
      await contract.tx
        .createNewPayment(
          { gasLimit: gasRequired },
          userInputAmount,
          VOTING_CONTRACT_ADDRESS,
          EpochTxn,
          salt
        )
        .signAndSend(data?.userAddress, (res: any, events: any) => {
          if (res?.status.isInBlock) {
            store.dispatch(
              setTransactionHashForCreatePost(
                (transactionHash = res?.status?.asInBlock.toHex())
              )
            ); // Store the transaction hash
          }
          if (res?.status.isFinalized) {
            if (res?.status.isFinalized === true) {
              //final post for audit TNX
              const AuditId: any = (res?.contractEvents[2]?.args[0]).toHuman();
              resolve({
                txHash: transactionHash,
                AuditId: AuditId,
                isFinalized: res?.status?.isFinalized,
              });
            }
          }
        });
    } catch (error) {
      console.log(error);
      errorCheck(error);
      reject(TXN_ERROR);
    }
  });
};

// Accept Bid  &  assign audit  TXN//////////////////////////
export const AcceptBidForPostTxn = async (
  data: any,
  AuditerAccountAddr: any
) => {
  return new Promise(async (resolve, reject) => {
    try {
      //contract call
      const provider = new WsProvider(RPC_URL_ASTAR);
      const api = new ApiPromise(options({ provider }));
      // initialise via static create
      const allInjected = await web3Enable(SUBWALLET_JS);
      await api.isReady;
      //setsigner
      api.setSigner(allInjected[0].signer);
      //abi
      const abi = new Abi(EscrowABI, api.registry.getChainProperties());
      // Initialise the contract for escrow
      const contract: any = new ContractPromise(
        api,
        abi,
        CONTRACT_ADDRESS_ESCROW
      );
      //gas
      const gasLimit: any = api.registry.createType(
        "WeightV2",
        api.consts.system.blockWeights["maxBlock"]
      );

      const { gasRequired } = await contract.query.assignAudit(
        data?.userAddress,
        {
          gasLimit: gasLimit,
        },
        data?.currentAuditId,
        AuditerAccountAddr,
        data?.bidAmount,
        data?.estimatedDelivery
      );
      let transactionHash: any; // Declare a variable to store the transaction hash
      //TX
      await contract.tx
        .assignAudit(
          { gasLimit: gasRequired },
          data?.currentAuditId,
          AuditerAccountAddr,
          data?.bidAmount,
          data?.estimatedDelivery
        )
        .signAndSend(data?.userAddress, (res: any) => {
          if (res?.status?.isInBlock) {
            store.dispatch(
              setTransactionHashForAcceptBid(
                (transactionHash = res?.status?.asInBlock.toHex())
              )
            ); // Store the transaction hash
          }
          if (res?.status?.isFinalized) {
            if (res?.status?.isFinalized === true) {
              resolve({
                txHash: transactionHash,
                isFinalized: res?.status?.isFinalized,
              });
            }
          }
        });
    } catch (error) {
      console.log(error);
      errorCheck(error);
      reject(TXN_ERROR);
    }
  });
};

// Submit bid report as per post TXN
export const submitAuditReportTxn = async (data: any) => {
  return new Promise(async (resolve, reject) => {
    try {
      //contract call
      const provider = new WsProvider(RPC_URL_ASTAR);
      const api = new ApiPromise(options({ provider }));
      // initialise via static create
      const allInjected = await web3Enable(SUBWALLET_JS);
      await api.isReady;

      //setsigner
      api.setSigner(allInjected[0].signer);
      //abi
      const abi = new Abi(EscrowABI, api.registry.getChainProperties());
      // Initialise the contract for escrow
      const contract: any = new ContractPromise(
        api,
        abi,
        CONTRACT_ADDRESS_ESCROW
      );
      //gas
      const gasLimit: any = api.registry.createType(
        "WeightV2",
        api.consts.system.blockWeights["maxBlock"]
      );
      //gas Required
      const { gasRequired } = await contract.query.markSubmitted(
        data?.userAddress,
        {
          gasLimit: gasLimit,
        },
        data?.auditId,
        data?.ipfsHash
      );
      //TX
      let transactionHash: any; // Declare a variable to store the transaction hash
      await contract.tx
        .markSubmitted({ gasLimit: gasRequired }, data?.auditId, data?.ipfsHash)
        .signAndSend(data?.userAddress, (res: any) => {
          if (res?.status.isInBlock) {
            store.dispatch(
              setTransactionHashForSubmitReport(
                (transactionHash = res?.status?.asInBlock.toHex())
              )
            ); // Store the transaction hash
          }
          if (res?.status.isFinalized) {
            if (res?.status.isFinalized === true) {
              resolve({
                txHash: transactionHash,
                isFinalized: res?.status.isFinalized,
              });
            }
          }
        });
    } catch (error) {
      console.log(error);
      errorCheck(error);
      reject(TXN_ERROR);
    }
  });
};
// ============================================================

//AcceptAuditReportTxn
export const acceptAuditReportTxn = async (data: any) => {
  return new Promise(async (resolve, reject) => {
    try {
      //contract call
      const provider = new WsProvider(RPC_URL_ASTAR);
      const api = new ApiPromise(options({ provider }));
      // initialise via static create
      const allInjected = await web3Enable(SUBWALLET_JS);
      await api.isReady;

      //setsigner
      api.setSigner(allInjected[0].signer);
      //abi
      const abi = new Abi(EscrowABI, api.registry.getChainProperties());
      // Initialise the contract for escrow
      const contract: any = new ContractPromise(
        api,
        abi,
        CONTRACT_ADDRESS_ESCROW
      );
      //gas
      const gasLimit: any = api.registry.createType(
        "WeightV2",
        api.consts.system.blockWeights["maxBlock"]
      );
      //gas Required
      const { gasRequired } = await contract.query.assessAudit(
        data?.userAddress,
        {
          gasLimit: gasLimit,
        },
        data?.auditId,
        data?.bool
      );
      let transactionHash: any; // Declare a variable to store the transaction hash
      //TX
      await contract.tx
        .assessAudit({ gasLimit: gasRequired }, data?.auditId, data?.bool)
        .signAndSend(data?.userAddress, (res: any) => {
          if (res?.status.isInBlock) {
            store.dispatch(
              setTransactionHashForSubmitReportByPatron(
                (transactionHash = res?.status?.asInBlock.toHex())
              )
            ); // Store the transaction hash
          }
          if (res?.status.isFinalized) {
            if (res?.status.isFinalized === true) {
              resolve({
                txHash: transactionHash,
                isFinalized: res?.status.isFinalized,
              });
            }
          }
        });
    } catch (error) {
      console.log(error);
      errorCheck(error);
      reject(TXN_ERROR);
    }
  });
};

export const setExtendTimelineTxn = async (data: any) => {
  return new Promise(async (resolve, reject) => {
    try {
      //contract call
      const provider = new WsProvider(RPC_URL_ASTAR);
      const api = new ApiPromise(options({ provider }));
      // initialise via static create
      const allInjected = await web3Enable("subwallet-js");
      await api.isReady;
      //setsigner
      api.setSigner(allInjected[0].signer);
      //abi
      const abi = new Abi(EscrowABI, api.registry.getChainProperties());
      // Initialise the contract for escrow
      const contract: any = new ContractPromise(
        api,
        abi,
        CONTRACT_ADDRESS_ESCROW
      );
      //gas
      const gasLimit: any = api.registry.createType(
        "WeightV2",
        api.consts.system.blockWeights["maxBlock"]
      );

      const { gasRequired } = await contract.query.requestAdditionalTime(
        data?.userAddress,
        {
          gasLimit: gasLimit,
        },
        data?.currentAuditId,
        data?.proposedDeliveryTime,
        data?.proposedAmount
      );
      //TX
      let transactionHash: any;
      // let blockTimeStamp:any; // Declare a variable to store the transaction hash

      await contract.tx
        .requestAdditionalTime(
          { gasLimit: gasRequired },
          data?.currentAuditId,
          data?.proposedDeliveryTime,
          data?.proposedAmount
        )
        .signAndSend(data?.userAddress, async (res: any) => {
          if (res?.status.isInBlock) {
            store.dispatch(
              setTransactionHashForExtendedForAuditor(
                (transactionHash = res?.status?.asInBlock.toHex())
              )
            );
          }
          if (res?.status.isFinalized) {
            if (res?.status.isFinalized === true) {
              resolve({
                txHash: transactionHash,
                isFinalized: res?.status.isFinalized,
              });
            }
          }
        });
    } catch (error) {
      console.log(error);
      errorCheck(error);
      reject(TXN_ERROR);
    }
  });
};

//DeclineAuditReportTxn
export const declineAuditReportTxn = async (data: any) => {
  return new Promise(async (resolve, reject) => {
    try {
      //contract call
      const provider = new WsProvider(RPC_URL_ASTAR);
      const api = new ApiPromise(options({ provider }));
      // initialise via static create
      const allInjected = await web3Enable(SUBWALLET_JS);
      await api.isReady;

      //setsigner
      api.setSigner(allInjected[0].signer);
      //abi
      const abi = new Abi(EscrowABI, api.registry.getChainProperties());
      // Initialise the contract for escrow
      const contract: any = new ContractPromise(
        api,
        abi,
        CONTRACT_ADDRESS_ESCROW
      );
      //gas
      const gasLimit: any = api.registry.createType(
        "WeightV2",
        api.consts.system.blockWeights["maxBlock"]
      );
      //gas Required
      const { gasRequired } = await contract.query.assessAudit(
        data?.userAddress,
        {
          gasLimit: gasLimit,
        },
        data?.auditId,
        data?.bool
      );
      let transactionHash: any; // Declare a variable to store the transaction hash
      //TX
      await contract.tx
        .assessAudit({ gasLimit: gasRequired }, data?.auditId, data?.bool)
        .signAndSend(data?.userAddress, (res: any) => {
          if (res?.status.isInBlock) {
            store.dispatch(
              setTransactionHashForSubmitReportDecline(
                (transactionHash = res?.status?.asInBlock.toHex())
              )
            ); // Store the transaction hash
          }
          if (res?.status.isFinalized) {
            if (res?.status.isFinalized === true) {
              resolve({
                txHash: transactionHash,
                isFinalized: res?.status.isFinalized,
              });
            }
          }
        });
    } catch (error) {
      console.log(error);
      errorCheck(error);
      reject(TXN_ERROR);
    }
  });
};

export const ExtendTimelineTxnForPatron = async (data: any) => {
  return new Promise(async (resolve, reject) => {
    try {
      //contract call
      if (data.isAccepted) {
        const provider = new WsProvider(RPC_URL_ASTAR);
        const api = new ApiPromise(options({ provider }));
        // initialise via static create
        const allInjected = await web3Enable("subwallet-js");
        await api.isReady;
        //setsigner
        api.setSigner(allInjected[0].signer);
        //abi
        const abi = new Abi(EscrowABI, api.registry.getChainProperties());
        // Initialise the contract for escrow
        const contract: any = new ContractPromise(
          api,
          abi,
          CONTRACT_ADDRESS_ESCROW
        );
        //gas
        const gasLimit: any = api.registry.createType(
          "WeightV2",
          api.consts.system.blockWeights["maxBlock"]
        );

        const { gasRequired } = await contract.query.approveAdditionalTime(
          data?.userAddress,
          {
            gasLimit: gasLimit,
          },
          data?.currentAuditId
        );
        //TX
        let transactionHash: any; // Declare a variable to store the transaction hash

        await contract.tx
          .approveAdditionalTime({ gasLimit: gasRequired }, data?.currentAuditId)
          .signAndSend(data?.userAddress, async (res: any) => {
            if (res?.status.isInBlock) {
              store.dispatch(
                setTransactionHashForExtendedForPatron(
                  (transactionHash = res?.status.asInBlock.toHex())
                )
              ); // Store the transaction hash
            }
            if (res?.status.isFinalized) {
              if (res?.status.isFinalized === true) {
                resolve({
                  txHash: transactionHash,
                  isFinalized: res?.status.isFinalized,
                });
              }
            }
          });
      }
    } catch (error) {
      console.log(error);
      errorCheck(error);
      reject(TXN_ERROR);
    }
  });
};

//claim Amount TXN///////////////////////
export const claimAmountTxn = async (data: any) => {
  return new Promise(async (resolve, reject) => {
    try {
      const provider = new WsProvider(RPC_URL_ASTAR);
      const api = new ApiPromise(options({ provider }));
      // initialise via static create
      const allInjected = await web3Enable(SUBWALLET_JS);
      await api.isReady;
      //setsigner
      api.setSigner(allInjected[0].signer);
      //abi
      const abi = new Abi(EscrowABI, api.registry.getChainProperties());
      // Initialise the contract class
      const contract: any = new ContractPromise(
        api,
        abi,
        CONTRACT_ADDRESS_ESCROW
      );
      // gas calculate
      const gasLimit: any = api.registry.createType(
        "WeightV2",
        api.consts.system.blockWeights["maxBlock"]
      );
      const { gasRequired } = await contract.query.expireAudit(
        data?.userAddress,
        {
          gasLimit: gasLimit,
        },
        data?.currentAuditId
      );

      let transactionHash: any; // Declare a variable to store the transaction hash
      //TX
      await contract.tx
        .expireAudit({ gasLimit: gasRequired }, data?.currentAuditId)
        .signAndSend(data?.userAddress, (res: any, events: any) => {
          if (res?.status.isInBlock) {
            store.dispatch(
              setTransactionHashForClaimAmount(
                (transactionHash = res.status.asInBlock.toHex())
              )
            ); // Store the transaction hash
          }
          if (res?.status.isFinalized) {
            if (res?.status.isFinalized === true) {
              //final post for audit TNX
              resolve({
                txHash: transactionHash,
                isFinalized: res?.status.isFinalized,
              });
            }
          }
        });
    } catch (error) {
      console.log(error);
      errorCheck(error);
      reject(TXN_ERROR);
    }
  });
};
