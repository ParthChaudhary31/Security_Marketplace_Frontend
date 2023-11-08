import "./Setting.scss";
import { Col, Row, Form } from "react-bootstrap";
import "cropperjs/dist/cropper.css";
import * as Yup from "yup";
import ButtonCustom from "../../../Common/Button/ButtonCustom";
import InputCustom from "../../../Common/Inputs/InputCustom";
import defaultUserIcon from "../../../../Assets/Images/defaultUserIcon.png";
import social_img from "../../../../Assets/Images/Icons/git-hub.svg";
import social_img2 from "../../../../Assets/Images/Icons/linkndin.svg";
import social_img3 from "../../../../Assets/Images/Icons/telegram.svg";
import social_img4 from "../../../../Assets/Images/Icons/Wallet-Setting.svg";
import TextArea from "../../../Common/FormInputs/TextArea";
import { useFormik } from "formik";
import {
  removeProfilePicture,
  updateUserProfile,
} from "../../../../Api/Actions/user.action";
import { useSelector } from "react-redux";
import store from "../../../../Redux/store";
import { updateProfileResponse } from "../../../../Constants/Interfaces/ApiResponses/UpdateProfileResponses";
import {
  setBio,
  setEmailAddress,
  setFirstName,
  setGitHub,
  setLinkdIn,
  setProfilePicture,
  setTelegram,
  setUserBalance,
  setlastName,
} from "../../../../Redux/userData/userData";
import {
  setIsWalletConnected,
  setWalletAddress,
} from "../../../../Redux/authenticationData/authenticationData";
import { UserData } from "../../../../Constants/Interfaces/Authentication/UserData";
import { AuthenticationData } from "../../../../Constants/Interfaces/Authentication/AuthenticationData";
import { createRef, useEffect, useState } from "react";
import UpdateProfileModal from "../../../Common/CommonModal/UpdateProfileModal/UpdateProfileModal";
import { v4 as uuidv4 } from "uuid"; // Import the UUID library
import { baseUrl, isImageFile } from "../../../../Constant";
import toaster from "../../../Common/Toast";
import { TrashIcon } from "../../../../Assets/Images/Icons/SvgIcons";
import ConfirmAlert from "../../../Common/Confirm/ConfirmAlert";
const Setting = () => {
  const userData: UserData = useSelector((state: any) => state?.userDataSlice);
  const [isFormModified, setIsFormModified] = useState(false);
  const authenticationData: AuthenticationData = useSelector(
    (state: any) => state?.authenticationDataSlice
  );
  const isWalletConnected = useSelector(
    (state: any) => state?.authenticationDataSlice?.isWalletConnected
  );
  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);
  const [imageUrl, setImageUrl] = useState<any>("");
  const [selectedImageFile, setSelectedImageFile] = useState<any>(null);
  const [imagePreview, setImagePreview] = useState<any>("");
  const [croppedImageUrl, setCroppedImageUrl] = useState("");
  const [CroppedFile, setCroppedFile] = useState<any>();
  const [rotation, setRotation] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");
  const [imageFileName, setImageFileName] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState<any>(false);

  const profilePictureUrl =
    baseUrl +
    (userData?.profilePicture && isImageFile(userData.profilePicture)
      ? userData.profilePicture
      : "");
  const emailAddress = useSelector(
    (state: any) => state?.userDataSlice?.emailAddress
  );

  const settingSchema = Yup.object().shape({
    firstName: Yup.string()
      .min(2, "Too Short!")
      .max(25, "Too Long!")
      .required("*This Field Is Required.")
      .matches(
        /^[^\d\s]+$/,
        "Numeric Characters And Spaces Are Not Allowed In The Name."
      ),
    gitHub: Yup.string().matches(
      /^(https?:\/\/)?(www\.)?github\.com\/[^\s/]+$/,
      "Please Enter A Valid GitHub Profile URL."
    ),
    telegram: Yup.string().matches(
      /^https:\/\/t\.me\/[A-Za-z0-9_]+$/,
      "Please Enter A Valid Telegram Profile URL."
    ),
    linkedIn: Yup.string().matches(
      /^https:\/\/www\.linkedin\.com\/in\/[A-Za-z0-9_.-]+$/,
      "Please Enter A Valid Linkedin Profile URL."
    ),
    lastName: Yup.string()
      .min(2, "Too Short!")
      .max(25, "Too Long!")
      .matches(
        /^[^\d\s]+$/,
        "Numeric Characters And Spaces Are Not Allowed In The Name."
      ),
    walletAddress: Yup.string().matches(
      /^[A-Za-z0-9]{48}$/,
      "Please Enter A Valid Wallet Address."
    ),
    bio: Yup.string().max(2000, "Maximum 2000 Characters Allowed."),
  });
  // profile
  const cropperRef: any = createRef();

  const handleFileSelect = (e: any) => {
    e.preventDefault();
    setError("");
    let files: any;
    if (e?.dataTransfer) {
      files = e?.dataTransfer?.files;
    } else if (e?.target) {
      files = e?.target.files;
    }

    // Get the file size in bytes
    const maxSizeBytes = 1024 * 1024; // 1 MB in bytes
    const fileSizeBytes = files[0]?.size;

    // Check if the file size exceeds the limit
    if (fileSizeBytes > maxSizeBytes) {
      setError("Please select an image with a file size of up to 1 MB.");
      return;
    }

    // File format validation
    const allowedFormats = ["image/jpeg", "image/png"];
    if (!allowedFormats?.includes(files[0]?.type)) {
      setError("Invalid image format. Please select a JPEG or PNG.");
      return;
    }

    setSelectedImageFile(files[0]); // Store the selected image file

    const reader = new FileReader();
    reader.onload = () => {
      if (reader?.result) {
        setImagePreview(reader?.result?.toString()); // Set the preview to the base64 data URL
        setShowModal(true);
      }
    };
    reader.readAsDataURL(files[0]);
    setImageUrl(files[0]); // Set the image URL with the file name after passing validations
    // Clear the selected image file input
    const fileInput: any = document.getElementById("profilePicture");
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const getCropData = () => {
    if (cropperRef.current?.cropper) {
      const croppedCanvas = cropperRef.current.cropper.getCroppedCanvas();

      if (croppedCanvas) {
        // Create a Blob from the canvas
        croppedCanvas.toBlob((blob: any) => {
          if (blob) {
            // Create a File object for the cropped image with required properties
            const randomName = `${uuidv4()}_cropped.${selectedImageFile?.name
              ?.split(".")
              .pop()}`;
            const croppedFile = new File([blob], randomName, {
              lastModified: selectedImageFile?.lastModified,
              // lastModifiedDate: selectedImageFile?.lastModifiedDate,
              type: blob.type,
            });

            // Set the cropped image data URL
            setCroppedImageUrl(
              croppedCanvas.toDataURL(selectedImageFile?.type)
            );
            setShowModal(false);
            // Use the croppedFile for further processing
            setCroppedFile(croppedFile);
          }
        }, selectedImageFile?.type);
      }
    }
  };

  const handleRotate = () => {
    if (typeof cropperRef.current?.cropper !== "undefined") {
      cropperRef.current?.cropper.rotate(90);
      setRotation(rotation + 90);
    }
  };
  const handleDeleteImage = () => {
    // Clear the selected image file input
    const fileInput: any = document.getElementById("profilePicture");
    if (fileInput) {
      fileInput.value = ""; // Reset the input element
    }
    setSelectedImageFile(null);
    setImageUrl("");
    setImagePreview("");
    setCroppedImageUrl("");
    setImageFileName("");
    setError("");
    setShowModal(false);
  };
  const handleRemovePicture = async () => {
    try {
      const response = await removeProfilePicture(emailAddress);
      if (response.status === 200) {
        store.dispatch(setProfilePicture(""));
      }
    } catch (error) {
      console.error("Error removing profile picture: ", error);
    } finally {
      setShowDeleteModal(false);
    }
  };

  const disconnectWalletOnChange = () => {
    try {
      store?.dispatch(setIsWalletConnected(false));
      store?.dispatch(setUserBalance(""));
    } catch (error: any) {
      return toaster.error(error.message);
    }
  };
  const formik = useFormik({
    initialValues: {
      profilePicture: CroppedFile || imageUrl || "",
      emailAddress: userData?.emailAddress,
      walletAddress: authenticationData?.walletAddress,
      firstName: userData?.firstName,
      lastName: userData?.lastName,
      gitHub: userData?.gitHub,
      linkedIn: userData?.linkedIn,
      telegram: userData?.telegram,
      bio: userData?.bio,
    },
    validationSchema: settingSchema,
    onSubmit: async (values) => {},
  });
  const updateProfile = async (e: any) => {
    try {
      e.preventDefault();

      const form = new FormData();
      form.append("profilePicture", CroppedFile || imageUrl || "");
      form.append("emailAddress", formik.values.emailAddress);
      form.append("walletAddress", formik.values.walletAddress);
      form.append("firstName", formik.values.firstName.trim());
      form.append("lastName", formik.values.lastName);
      form.append("gitHub", formik.values.gitHub.trim());
      form.append("linkedIn", formik.values.linkedIn.trim());
      form.append("telegram", formik.values.telegram.trim());
      form.append("bio", formik.values.bio.trim());
      const result: updateProfileResponse = await updateUserProfile(form);

      if (result?.status === 200) {
        store?.dispatch(setProfilePicture(result?.data?.profilePicture));
        store?.dispatch(setFirstName(result?.data?.firstName));
        store?.dispatch(setlastName(result?.data?.lastName));
        store?.dispatch(setEmailAddress(result?.data?.emailAddress));
        store?.dispatch(setGitHub(result?.data?.gitHub));
        store?.dispatch(setLinkdIn(result?.data?.linkedIn));
        store?.dispatch(setTelegram(result?.data?.telegram));
        store?.dispatch(setBio(result?.data?.bio));
        if (
          result?.data?.walletAddress !== authenticationData?.walletAddress &&
          isWalletConnected
        ) {
          disconnectWalletOnChange();
        }
        store?.dispatch(setWalletAddress(result?.data?.walletAddress));
      }
    } catch (error) {
      console.error(error);
    }
  };
  const initialFormValues = {
    profilePicture: imageFileName || imageUrl || "",
    emailAddress: userData?.emailAddress,
    walletAddress: authenticationData?.walletAddress,
    firstName: userData?.firstName,
    lastName: userData?.lastName,
    gitHub: userData?.gitHub,
    linkedIn: userData?.linkedIn,
    telegram: userData?.telegram,
    bio: userData?.bio,
  };
  useEffect(() => {}, [isFormModified]);

  useEffect(() => {
    const isModified = Object.keys(formik.values).some(
      (key) => formik.values[key] !== initialFormValues[key]
    );
    setIsFormModified(isModified);
    if (selectedImageFile != null)
      formik.values.profilePicture = selectedImageFile;
  }, [
    formik.values,
    imageFileName,
    imageUrl,
    userData,
    authenticationData,
    selectedImageFile,
  ]);

  return (
    /*------------Setting Page Starts------------*/

    <section className="Setting">
      <h4 className="common-heading">Settings</h4>
      <div className="Setting_box">
        <div className="Setting_box_header">
          <div className="Setting_box_header_info">
            <div className="list_image">
              <img
                src={defaultUserIcon}
                alt="list-img"
                className="list_image_pic"
                onClick={handleShow}
              />
              <div className="upload_img">
                <img
                  src={croppedImageUrl || imagePreview || profilePictureUrl}
                  alt="Selected file"
                  className="profile_img"
                />
                <div className="inputFilePreview">
                  {profilePictureUrl && isImageFile(profilePictureUrl) && (
                    <span
                      onClick={() => setShowDeleteModal(true)}
                      className="cross_icon"
                      style={{ cursor: "pointer" }}
                    >
                      <TrashIcon />
                    </span>
                  )}
                </div>
                <InputCustom
                  id="profilePicture"
                  name="profilePicture"
                  type="file"
                  onChange={(e: any) => handleFileSelect(e)}
                  accept="image/*"
                  isInvalid={
                    formik.touched.profilePicture && formik.errors.firstName
                      ? "is-invalid"
                      : ""
                  }
                  error={
                    formik.touched.profilePicture
                      ? formik.errors.profilePicture
                      : null
                  }
                />
                {error && <span className="error-message">{error}</span>}
              </div>
            </div>
            <div className="list_content">
              <h6 className="user_info_name">
                {userData?.firstName} {userData?.lastName}
              </h6>
              <p className="user_email">{userData?.emailAddress}</p>
            </div>
          </div>
        </div>
        <Form>
          <Form.Group className="Post_request_inputList">
            <Row>
              <Col md={6} xl={4}>
                <InputCustom
                  label="First Name"
                  placeholder="Enter your First name"
                  id="firstName"
                  name="firstName"
                  type="text"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  defaultValue={userData?.firstName}
                  value={formik.values.firstName}
                  isInvalid={
                    formik.touched.firstName && formik.errors.firstName
                      ? "is-invalid"
                      : ""
                  }
                  error={
                    formik.errors.firstName || formik.touched.firstName ? (
                      <span className="error-message">
                        {formik.errors.firstName}
                      </span>
                    ) : null
                  }
                ></InputCustom>
              </Col>
              <Col md={6} xl={4}>
                <InputCustom
                  label="Last Name"
                  placeholder="Enter your Last name"
                  id="lastName"
                  name="lastName"
                  type="text"
                  onChange={formik.handleChange}
                  defaultValue={userData?.lastName || ""}
                  value={formik.values.lastName}
                  onBlur={formik.handleBlur}
                  isInvalid={
                    formik.touched.lastName && formik.errors.lastName
                      ? "is-invalid"
                      : ""
                  }
                  error={
                    formik.errors.lastName || formik.touched.lastName ? (
                      <span className="error-message">
                        {formik.errors.lastName}
                      </span>
                    ) : null
                  }
                ></InputCustom>
              </Col>
              <Col md={6} xl={4}>
                <InputCustom
                  label="Email Address"
                  placeholder="Enter your Email Address"
                  id="emailAddress"
                  name="emailAddress"
                  type="text"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  readOnly={true}
                  value={formik.values.emailAddress}
                  isInvalid={
                    formik.touched.emailAddress && formik.errors.emailAddress
                      ? "is-invalid"
                      : ""
                  }
                  error={
                    formik.errors.emailAddress &&
                    formik.touched.emailAddress ? (
                      <span className="error-message"></span>
                    ) : null
                  }
                  disabled
                ></InputCustom>
              </Col>
              <Col md={6} xl={4}>
                <Form.Label>GitHub</Form.Label>
                <div className="social_account">
                  <div className="social_links">
                    <div className="social_img">
                      <img src={social_img} alt="social-img" />
                    </div>
                    {formik.values.gitHub ? (
                      <a
                        href={formik.values.gitHub}
                        target="_blank"
                        rel="noreferrer"
                      >
                        GitHub
                      </a>
                    ) : (
                      <span>GitHub</span>
                    )}
                  </div>
                  <InputCustom
                    placeholder="Enter your Github Profile"
                    className="github_inp"
                    id="gitHub"
                    name="gitHub"
                    inputName="post_input blue"
                    type="text"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    defaultValue={userData?.gitHub}
                    value={formik.values.gitHub}
                    isInvalid={
                      formik.touched.gitHub && formik.errors.gitHub
                        ? "is-invalid"
                        : ""
                    }
                    error={
                      formik.errors.gitHub && formik.touched.gitHub ? (
                        <span className="error-message"></span>
                      ) : null
                    }
                  ></InputCustom>
                </div>
                <span className="error-message">{formik.errors.gitHub}</span>
              </Col>
              <Col md={6} xl={4}>
                <Form.Label>Linkedin</Form.Label>
                <div className="social_account">
                  <div className="social_links">
                    <div className="social_img">
                      <img src={social_img2} alt="social-img" />
                    </div>
                    {formik.values.linkedIn ? (
                      <a
                        href={formik.values.linkedIn}
                        target="_blank"
                        rel="noreferrer"
                        className="linkedin_link"
                      >
                        Linkedin
                      </a>
                    ) : (
                      <span>Linkedin</span>
                    )}
                  </div>

                  <InputCustom
                    placeholder="Enter your Linkedin Profile"
                    id="linkedIn"
                    className="linked_inp"
                    inputName="post_input blue2"
                    name="linkedIn"
                    type="text"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    defaultvalue={userData?.linkedIn}
                    value={formik.values.linkedIn}
                    isInvalid={
                      formik.touched.linkedIn && formik.errors.linkedIn
                        ? "is-invalid"
                        : ""
                    }
                    error={
                      formik.errors.linkedIn && formik.touched.linkedIn ? (
                        <span className="error-message"></span>
                      ) : null
                    }
                  ></InputCustom>
                </div>
                <span className="error-message">{formik.errors.linkedIn}</span>
              </Col>
              <Col md={6} xl={4}>
                <Form.Label>Telegram</Form.Label>
                <div className="social_account">
                  <div className="social_links">
                    <div className="social_img">
                      <img src={social_img3} alt="social-img" />
                    </div>
                    {formik.values.telegram ? (
                      <a
                        href={formik.values.telegram}
                        target="_blank"
                        rel="noreferrer"
                        className="telegram_link"
                      >
                        Telegram
                      </a>
                    ) : (
                      <span>Telegram</span>
                    )}
                  </div>
                  <InputCustom
                    placeholder="Enter your Telegram Link"
                    id="telegram"
                    inputName="post_input blue3"
                    className="telegram_inp"
                    name="telegram"
                    type="text"
                    onChange={formik.handleChange}
                    defaultvalue={formik.values.telegram}
                    onBlur={formik.handleBlur}
                    value={formik.values.telegram}
                    isInvalid={
                      formik.touched.telegram && formik.errors.telegram
                        ? "is-invalid"
                        : ""
                    }
                    error={
                      formik.errors.telegram && formik.touched.telegram ? (
                        <span className="error-message"></span>
                      ) : null
                    }
                  ></InputCustom>
                </div>
                <span className="error-message">{formik.errors.telegram}</span>
              </Col>
              <Col md={6} xl={4}>
                <Form.Label>Wallet Address</Form.Label>
                <div className="social_account">
                  <div className="social_links">
                    <div className="social_img">
                      <img src={social_img4} alt="social-img" />
                    </div>
                    <span>Wallet Address</span>
                  </div>
                  <InputCustom
                    placeholder="Enter your Wallet Address"
                    id="walletAddress"
                    name="walletAddress"
                    type="text"
                    onChange={formik.handleChange}
                    defaultvalue={formik.values.walletAddress}
                    onBlur={formik.handleBlur}
                    value={formik.values.walletAddress}
                    isInvalid={
                      formik.touched.walletAddress &&
                      formik.errors.walletAddress
                        ? "is-invalid"
                        : ""
                    }
                  ></InputCustom>
                </div>
                <span className="error-message">
                  {formik.errors.walletAddress}
                </span>
              </Col>
              <Row className="p-0 m-0">
                <Col xl={4}>
                  <div className="text_area">
                    <TextArea
                      placeholder="Enter About Yourself"
                      label="Profile Bio"
                      id="bio"
                      name="bio"
                      type="text"
                      onChange={formik.handleChange}
                      defaultvalue={formik.values.bio}
                      onBlur={formik.handleBlur}
                      value={formik.values.bio}
                      isInvalid={
                        formik.touched.bio && formik.errors.bio
                          ? "is-invalid"
                          : ""
                      }
                      error={
                        formik.errors.bio && formik.touched.bio ? (
                          <span className="error-message">
                            {formik.errors.bio}
                          </span>
                        ) : null
                      }
                    ></TextArea>
                  </div>
                </Col>
              </Row>
              <Col xl={12}>
                <ButtonCustom
                  title="Update"
                  type="submit"
                  className="confirm_btn"
                  onClick={(e: any) => {
                    if (!isFormModified || !formik.dirty) {
                      e.preventDefault();
                      toaster.info(
                        "Please Make Some Changes To Update Profile."
                      );
                    } else if (!formik.isValid) {
                      e.preventDefault();
                      toaster.error("Please Correct The Form Errors.");
                    } else {
                      updateProfile(e);
                      handleDeleteImage();
                      setIsFormModified(false);
                    }
                  }}
                />
              </Col>
            </Row>
          </Form.Group>
        </Form>
        <UpdateProfileModal
          show={showModal}
          onHide={() => setShowModal(false)}
          imagePreview={imagePreview}
          getCropData={getCropData}
          cropperRef={cropperRef}
          handleRotate={handleRotate}
          handleDeleteImage={handleDeleteImage}
        />
        <ConfirmAlert
          show={showDeleteModal}
          onHide={() => setShowDeleteModal(false)}
          handleRemovePicture={handleRemovePicture}
        />
      </div>
    </section>

    /*------------Setting Page Ends------------*/
  );
};

export default Setting;
