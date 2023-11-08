import { Dispatch, useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container, Form } from "react-bootstrap";
import ButtonCustom from "../../../Common/Button/ButtonCustom";
import InputCustom from "../../../Common/Inputs/InputCustom";
import toaster from "../../../Common/Toast";
import {
  convertWithDecimal,
  cryptoDecimals,
  divideWithDecimal,
} from "../../../../Services/common.service";
import Web3 from "web3";
import { TOKEN_ADDRESS, RPC_URL, USDT_ADDRESS } from "../../../../Constant";
import {
  callContractGetMethod,
  callContractSendMethod,
} from "../../../../Api/Actions/contract.action";
import useDebounce from "../../../../hooks/useDebounce";
import CustomSelect from "../../../Common/Select/Select";
import CommonHeading from "../../../Common/CommonHeading/CommonHeading";
import "./BuyToken.scss";
import store from "../../../../Redux/store";
import { setErrorMessage } from "../../../../Redux/authenticationData/authenticationData";
import { apiCallPost } from "../../../../Services/axios.service";

const BuyToken = () => {
  /**CREATE DISPATCH OBJECT */
  const dispatch: Dispatch<any> = useDispatch();

  /**GET STATES FROM STORE */
  const walletAddress = useSelector((state: any) => state.user?.walletAddress);
  const bnbDecimals = useSelector((state: any) => state.ico?.bnbDecimals);
  const usdtDecimals = useSelector((state: any) => state.ico?.usdtDecimals);
  const errorMessage = useSelector(
    (state: any) => state?.authenticationDataSlice?.errorMessage
  );
  /**DECLARE VARIABLES */
  const [payOption, setPayOption] = useState<any>(1);
  const [transactionStatus, setTransactionStatus] = useState<any>({
    heading: "",
    bodyText: "",
    status: "",
    txHash: "",
  });
  const [amount, setAmount] = useState<any>(0);
  const [balance, setBalance] = useState<any>(0);
  const [tokenSymbol, setTokenSymbol] = useState<any>("");

  const [calToken, setCalToken] = useState(0);
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);

  useDebounce(() => handeGetCalToken(), 1000, [amount]);

  useEffect(() => {
    const getProducts = async () => {
      /**EXAMPLE FOR API CALL WITH DUMMY PARMS */
      const products: any = await dispatch(
        apiCallPost("GETPRODUCTS",{},{}, { status: true, limit: 10 })
      );
    };
    getProducts();
  }, [dispatch]);

  useEffect(() => {
    /**GET USER BALANCE */
    getUserBalance();
    handeGetCalToken();
    handleGetTokenSymbol();
    // eslint-disable-next-line
  }, [payOption]);

  const handleGetTokenSymbol = async () => {
    const result = await dispatch(
      callContractGetMethod("symbol", [], "dynamic", false, TOKEN_ADDRESS)
    );
    setTokenSymbol(result);
  };

  const handeGetCalToken = async () => {
    let result: any = await dispatch(
      callContractGetMethod(
        "calculateTokens",
        [
          payOption,
          convertWithDecimal(
            amount,
            parseInt(payOption) === 1 ? bnbDecimals : usdtDecimals
          ),
        ],
        "ico",
        false
      )
    );
    setCalToken(result._totalTokens);
  };

  /**METHOD FOR BUY TOKEN */
  const BuyToken = async (event: any) => {
    event.preventDefault();

    /**CHECK WALLET IS CONNECTED OR NOT */
    if (!walletAddress) {
      toaster.error("Please connect your wallet ");
      return false;
    }

    /**GET VLAUE WITH DECIMAL FOR CONTRACT CALL */
    let amountForBuy: any = await convertWithDecimal(
      amount,
      parseInt(payOption) === 1 ? bnbDecimals : usdtDecimals
    );

    /**CHECK USER HAVE BALANCE FOR BUY OR NOT */
    let userBalance = await getUserBalance();
    if (parseFloat(userBalance) < parseFloat(amountForBuy)) {
      toaster.error(
        `Insufficient balance of ${parseInt(payOption) === 1 ? "BNB" : "USDT"}`
      );
      return false;
    }
    setShow(true);

    setTransactionStatus({
      heading: "Buy",
      bodyText: "Confirm Transaction",
      status: "pending",
      txHash: null,
    });
    /**CALL CONRACT SEND METHOD FOR BUY */
    let result: any = await dispatch(
      callContractSendMethod(
        "buyTokens",
        [amountForBuy, payOption],
        walletAddress,
        "ico",
        parseInt(payOption) === 1 ? amountForBuy : null
      )
    );
    if (result && result.status) {
      setTransactionStatus({
        heading: "Buy",
        bodyText: "Transaction Confirmed",
        status: "success",
        txHash: result?.transactionHash,
      });
      getUserBalance();
      setAmount("");
      toaster.success("Token bought successfull");
    } else {
      setTransactionStatus({
        heading: "Buy",
        bodyText: errorMessage?errorMessage:"Error While executing transaction",
        status: "error",
        txHash: null,
      });
      store?.dispatch(setErrorMessage(""));
    }
  };

  /**GET USER BALANCE */
  const getUserBalance = async () => {
    if (walletAddress) {
      let balance: any = "";
      let mainBalance: any = "";
      if (parseInt(payOption) === 2) {
        /**GET USER UTDT BALANCE BY DYNAMIC ABI AND  USDT_ADDRESS */
        mainBalance = await dispatch(
          callContractGetMethod(
            "balanceOf",
            [walletAddress],
            "dynamic",
            false,
            USDT_ADDRESS
          )
        );
        balance = await divideWithDecimal(mainBalance, usdtDecimals);
      } else if (parseInt(payOption) === 1) {
        /**GET USER BNB BALANCE */
        let web3Instance = new Web3(RPC_URL);
        mainBalance = await web3Instance.eth.getBalance(walletAddress);
        balance = await divideWithDecimal(mainBalance, bnbDecimals);
      }
      setBalance(balance);
      return mainBalance;
    }
  };

  return (
    <Container fluid>
      <section className="dashboard">
        <div className="dashboard_box">
          {/* <h1>Buy Token</h1> */}
          <CommonHeading heading="Buy Token" />
          <Form onSubmit={BuyToken}>
            <Form.Group className="buy_token" controlId="formBasicEmail">
              <InputCustom
                type="number"
                label="Enter Amount"
                className="mb-0 max-field"
                placeholder="0.0"
                Fstar="*"
                infoclass="d-none"
                value={amount ? amount : ""}
                step={"any"}
                name="amount"
                onChange={(e: any) =>
                  setAmount(e.target.value ? e.target.value : 0)
                }
                required
                min={0}
                maxlength={10}
              >
                <div className="SelectValue">
                  <CustomSelect
                    defaultValue={{ value: 1, label: "BNB" }}
                    onChange={(option: { value: any }) =>
                      setPayOption(option?.value)
                    }
                    options={[
                      { value: 1, label: "BNB" },
                      { value: 2, label: "USDT" },
                    ]}
                  />
                </div>
              </InputCustom>
            </Form.Group>
            <div className="d-flex justify-content-between">
              <span className="baclanceAmount">
                Balance : {cryptoDecimals(balance)}{" "}
                {parseInt(payOption) === 1 ? "BNB" : "USDT"}
              </span>
              <span className="baclanceAmount">
                You Get : {cryptoDecimals(calToken)} {tokenSymbol}
              </span>
            </div>
            <ButtonCustom
              title="Buy"
              fluid
              type="submit"
              onClick={(e: any) => {
                BuyToken(e);
              }}
            />
          </Form>
          {/* CONFIRMATION AND APPROVAL MODAL COMPONENT */}
          {/* <CommonTrnxModal
            show={show}
            handleClose={handleClose}
            trnxStatus={transactionStatus}
            trnxfunction={BuyToken}
          /> */}
        </div>
      </section>
    </Container>
  );
};

export default BuyToken;
