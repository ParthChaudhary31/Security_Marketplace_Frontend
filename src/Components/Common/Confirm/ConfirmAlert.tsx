import CommonModal from "../CommonModal/CommonModal";
import ButtonCustom from "../Button/ButtonCustom";
import "./ConfirmAlert.scss";

const ConfirmAlert = (props) => {
  return (
    <>
      <CommonModal
        show={props?.show}
        onHide={props?.onHide}
        className="delete_modal"
        heading="Do you want to delete the profile picture?"
        crossBtn
      >
        <div className="otp">
          <div className="button_sections d-flex text-center">
            <ButtonCustom
              title="Yes"
              className="verify_btn"
              onClick={props?.handleRemovePicture}
            />
            <ButtonCustom
              title="No"
              className="verify_btn"
              onClick={props?.onHide}
            />
          </div>
        </div>
      </CommonModal>
    </>
  );
};

export default ConfirmAlert;
