import "./UpdateProfileModal.scss";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import ButtonCustom from "../../Button/ButtonCustom";
import CommonModal from "../CommonModal";

const UpdateProfileModal = ({
  show,
  onHide,
  imagePreview,
  getCropData,
  cropperRef,
  handleRotate,
  handleDeleteImage,
}: any) => {
  return (
    <CommonModal
      show={show}
      heading="Profile Picture Cropper"
      className="update_modal"
      onHide={() => {
        handleDeleteImage();
        onHide();
      }}
      backdrop={"static"}
    crossBtn
    >
      <Cropper
        ref={cropperRef}
        style={{ height: 300, width: "100%" }}
        zoomTo={0.5}
        preview=".img-preview"
        src={imagePreview}
        initialAspectRatio={1}
        viewMode={1}
        minCropBoxHeight={10}
        minCropBoxWidth={10}
        background={false}
        responsive={true}
        autoCropArea={1}
        autoCrop={true}
        checkOrientation={false}
        guides={true}
        cropBoxMovable={true}
        cropBoxResizable={false}
        dragMode="none" // Disable cropping entirely
      />
      <div className="footer_sec">
        <ButtonCustom
          title="Cancel"
          onClick={() => {
            handleDeleteImage();
            onHide();
          }}
          className="me-3"
        />
        {/* <RotateIcons onClick={handleRotate} /> */}
        <ButtonCustom title="Crop" onClick={getCropData} className="ms-3" />
      </div>
    </CommonModal>
  );
};

export default UpdateProfileModal;
