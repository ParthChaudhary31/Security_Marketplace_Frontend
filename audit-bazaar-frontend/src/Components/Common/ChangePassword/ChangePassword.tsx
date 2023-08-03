import "./ChangePassword.scss";
import CommonModal from "../CommonModal/CommonModal";
import ButtonCustom from "../Button/ButtonCustom";
import InputCustom from "../Inputs/InputCustom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useSelector } from "react-redux";

const ChangePassword = (props) => {
  const userData = useSelector((state: any) => state?.userDataSlice);

  const loginSchema = Yup.object().shape({
    emailAddress: Yup.string().required("*This Field is required"),
    oldPassword: Yup.string().required("*This Field is required"),
    newPassword: Yup.string().required("*This Field is required"),
    confirmPassword: Yup.string().required("*This Field is required"),
  });

  const formik = useFormik({
    initialValues: {
      emailAddress: "",
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: loginSchema,
    onSubmit: async (values) => {},
  });
  const changePassword = async (e) => {
    try {
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <CommonModal
        heading="Change Password"
        show={props.show}
        onHide={props.onHide}
        className="change-modal"
        crossBtn
      >
        <div className="change-modal-inner">
          <InputCustom
            placeholder="Enter your Old Password"
            id="oldPassword"
            name="oldPassword"
            type="text"
            onChange={formik.handleChange}
            autoFocus={true}
            defaultValue={formik.values.oldPassword}
            value={formik.values.oldPassword}
            isInvalid={
              formik.touched.oldPassword && formik.errors.oldPassword
                ? "is-invalid"
                : ""
            }
            error={
              formik.errors.oldPassword && formik.touched.oldPassword ? (
                <span className="error-message">
                  {formik.errors.oldPassword}
                </span>
              ) : null
            }
          ></InputCustom>
          <InputCustom
            placeholder="Enter your New Password"
            id="newPassword"
            name="newPassword"
            type="text"
            onChange={formik.handleChange}
            autoFocus={true}
            defaultValue={formik.values.newPassword}
            value={formik.values.newPassword}
            isInvalid={
              formik.touched.newPassword && formik.errors.newPassword
                ? "is-invalid"
                : ""
            }
            error={
              formik.errors.newPassword && formik.touched.newPassword ? (
                <span className="error-message">
                  {formik.errors.newPassword}
                </span>
              ) : null
            }
          ></InputCustom>
          <InputCustom
            placeholder="Enter your ConfirmPassword"
            id="confirmPassword"
            name="confirmPassword"
            type="text"
            onChange={formik.handleChange}
            autoFocus={true}
            defaultValue={formik.values.confirmPassword}
            value={formik.values.confirmPassword}
            isInvalid={
              formik.touched.confirmPassword && formik.errors.confirmPassword
                ? "is-invalid"
                : ""
            }
            error={
              formik.errors.confirmPassword &&
              formik.touched.confirmPassword ? (
                <span className="error-message">
                  {formik.errors.confirmPassword}
                </span>
              ) : null
            }
          ></InputCustom>

          <ButtonCustom
            title="Change Password"
            type="submit"
            className="bordered mw-100"
            onClick={(e) => changePassword(e)}
          />
        </div>
      </CommonModal>
    </>
  );
};

export default ChangePassword;
