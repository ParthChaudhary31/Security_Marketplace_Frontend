import { useEffect, useState } from "react";
import CommonModal from "../CommonModal/CommonModal";
import ButtonCustom from "../Button/ButtonCustom";
import "./VoteArbiterModal.scss";
import TransactionModal from "../SubmitRequestModal/transaction-modal/transaction-modal/TransactionModal";
import store from "../../../Redux/store";
import { setErrorMessage } from "../../../Redux/authenticationData/authenticationData";
import { ERROR_TXN, PENDING_TXN, SUCCESS_TXN, TRANSACTION_PROCESS } from "../../../Constant";

const VoteArbiterModal = ({ show, onHide, handleVoting }) => {
  const [crossIcon, setCrossIcon] = useState<any>(false);
  const [loading, setLoading] = useState({
    nodiscrepancies: false,
    minordiscrepancies: false,
    moderatediscrepancies: false,
    reject: false,
  });
  const [modalData, setModalData] = useState<any>({
    heading: "",
    bodyText: "",
    status: "",
    txHash: "",
  });

  const [selectedOption, setSelectedOption] = useState<
    | "nodiscrepancies"
    | "minordiscrepancies"
    | "moderatediscrepancies"
    | "reject"
    | null
  >(null);

  const handleVote = async ({
    votes,
    option,
    voterId,
  }: {
    votes: boolean;
    option: string | null;
    voterId: number;
  }) => {
    try {
      if (option) {
        setLoading({ ...loading, [option]: true });
      }
      setModalData({
        heading: "Vote",
        bodyText: TRANSACTION_PROCESS,
        status: PENDING_TXN,
        txHash: null,
      });

      const response = await handleVoting(votes, option, voterId);
      if (response) {
        setModalData({
          heading: "Vote",
          bodyText: "Voting has been completed successfully",
          status: SUCCESS_TXN,
          txHash: response?.transactionHash,
        });
        setCrossIcon(true);
      } else {
        const errorMessage: any =
        store?.getState()?.authenticationDataSlice?.errorMessage;
        setModalData({
          heading: "Vote",
          bodyText: errorMessage ? errorMessage : "Voting failed.",
          status: ERROR_TXN,
          txHash: null,
        });
      }
      store?.dispatch(setErrorMessage(""));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (!show) {
      setSelectedOption(null);
      setLoading({
        nodiscrepancies: false,
        minordiscrepancies: false,
        moderatediscrepancies: false,
        reject: false,
      });
      setModalData({
        heading: "",
        bodyText: "",
        status: "",
        txHash: "",
      });

      setErrorMessage("");
    }
  }, [show]);

  return (
    <>
      <CommonModal
        heading={"Vote"}
        show={show}
        onHide={onHide}
        className="vote_modal"
        crossBtn
      >
        <div className="btn_sec">
          {!loading.reject &&
          !loading.nodiscrepancies &&
          !loading.minordiscrepancies &&
          !loading.moderatediscrepancies ? (
            <>
              <ButtonCustom
                title={"No Discrepancies"}
                onClick={() => {
                  handleVote({
                    votes: true,
                    option: "nodiscrepancies",
                    voterId: 1,
                  });
                  setSelectedOption("nodiscrepancies");
                }}
              />
              <ButtonCustom
                title={"Minor Discrepancies"}
                onClick={() => {
                  handleVote({
                    votes: true,
                    option: "minordiscrepancies",
                    voterId: 2,
                  });
                  setSelectedOption("minordiscrepancies");
                }}
              />
              <ButtonCustom
                title={"Moderate Discrepancies"}
                onClick={() => {
                  handleVote({
                    votes: true,
                    option: "moderatediscrepancies",
                    voterId: 3,
                  });
                  setSelectedOption("moderatediscrepancies");
                }}
              />
              <ButtonCustom
                title={"Reject Audit Report"}
                onClick={() => {
                  handleVote({
                    votes: true,
                    option: "reject",
                    voterId: 4,
                  });
                  setSelectedOption("reject");
                }}
              />
            </>
          ) : (
            <div>
              <TransactionModal
                handleClose={onHide}
                successClose={onHide}
                crossIcon={crossIcon}
                show={show}
                modalData={modalData}
                handleFunction={() =>
                  handleVote({
                    votes: selectedOption !== null,
                    option: selectedOption || "",
                    voterId: 1,
                  })
                }
              />
            </div>
          )}
        </div>
      </CommonModal>
    </>
  );
};

export default VoteArbiterModal;
