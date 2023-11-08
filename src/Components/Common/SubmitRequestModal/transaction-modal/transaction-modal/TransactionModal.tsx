import Lottie from "react-lottie";
import loading from "../../../../../Assets/animations/loading.json";
import tick from "../../../../../Assets/animations/tick.json";
import error from "../../../../../Assets/animations/error.json";
import "./TransactionModal.scss";
import { Col, Modal, Row } from "react-bootstrap";
import ButtonCustom from "../../../Button/ButtonCustom";
import { SHIBUYA_BASE_URL } from "../../../../../Constant";
import closeIcon from "../../../../../Assets/Images/Icons/close.png";

const TransactionModal = ({
  show,
  handleClose,
  crossIcon,
  successClose,
  modalData,
  handleFunction,
}) => {
  const viewTransactiononExplorer = (e: any) => {
    e.preventDefault();
    window.open(`${SHIBUYA_BASE_URL}/${modalData?.txHash}`);
  };

  return (
    <Modal
      className="transaction_modal"
      show={show}
      centered
      handleClose={handleClose}
      backdropClassName="transaction_modal_bckdrop"
    >
      <Modal.Header>
        <Modal.Title>{modalData?.heading}</Modal.Title>
        {crossIcon === true ? (
          <button className="modal_close_btn" onClick={() => handleClose()}>
            <img src={closeIcon} alt="close-icon" />
          </button>
        ) : (
          ""
        )}
      </Modal.Header>
      <Modal.Body title={modalData?.heading}>
        <p className="transaction_text">{modalData?.bodyText}</p>
        <div
          className={`lottie_animation ${
            modalData?.status === "success" ? "tick_animation" : ""
          }`}
        >
          <Lottie
            options={{
              loop:
                modalData?.status === "success"
                  ? false
                  : modalData?.status === "error"
                  ? false
                  : true,
              animationData:
                modalData?.status === "success"
                  ? tick
                  : modalData?.status === "error"
                  ? error
                  : loading,
              autoplay: true,
            }}
          />
        </div>
        {modalData?.txHash ? <div className="url_box"></div> : null}
        {modalData?.status === "success" || modalData?.status === "error" ? (
          <div className="transaction_action_btn">
            <Row>
              <Col sm={6}>
                <ButtonCustom
                  fluid
                  onClick={() => successClose()}
                  title="Close"
                  className="danger"
                />
              </Col>
              {modalData?.status === "error" ? (
                <Col sm={6}>
                  <ButtonCustom
                    fluid
                    title="Retry"
                    onClick={() => handleFunction()}
                  />
                </Col>
              ) : modalData?.status === "success" && modalData?.txHash ? (
                <Col sm={6}>
                  <ButtonCustom
                    fluid
                    title="View Transaction"
                    onClick={(e: any) => viewTransactiononExplorer(e)}
                  />
                </Col>
              ) : null}
            </Row>
          </div>
        ) : null}
      </Modal.Body>
    </Modal>
  );
};

export default TransactionModal;
