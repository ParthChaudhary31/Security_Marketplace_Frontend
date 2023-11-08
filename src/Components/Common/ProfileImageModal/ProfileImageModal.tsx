import "../CommonModal/UpdateProfileModal/UpdateProfileModal.scss";
import CommonModal from "../CommonModal/CommonModal";
import ButtonCustom from "../Button/ButtonCustom";
import selected_image from "../../../Assets/Images/defaultUserIcon.png";

const ProfileImageModal = (props) => {
  return (
    <>
      <CommonModal
        show={props?.show}
        onHide={props?.onHide}
        heading="Update Profile"
        className="update_profile"
        crossBtn
      >
        <img src={selected_image} alt="sel_img" />
        <div className="btn_sec">
          <ButtonCustom title="Ok" />
          <ButtonCustom title="Rotate" />
          <ButtonCustom title="Cancel" />
        </div>
      </CommonModal>
    </>
  );
};

export default ProfileImageModal;
