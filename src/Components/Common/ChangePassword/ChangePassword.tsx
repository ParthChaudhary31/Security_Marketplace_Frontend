import "./ChangePassword.scss";
import CommonModal from "../CommonModal/CommonModal";
import ButtonCustom from "../Button/ButtonCustom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { updatePasswordResponse } from "../../../Constants/Interfaces/ApiResponses/updatePassword";
import { updatePassword } from "../../../Api/Actions/user.action";
import { useSelector } from "react-redux";
import { CloseEye, EyeIcon } from "../../../Assets/Images/Icons/SvgIcons";
import Password from "../Inputs/Password";
import { useEffect, useState } from "react";
import { handleLogout } from "../../../Services/Helpers/stateManagement";
import { useNavigate } from "react-router-dom";

const ChangePassword = (props: any) => {
  const navigate = useNavigate();
  const userData = useSelector((state: any) => state?.userDataSlice);
  const [isPasswordMatch, setIsPasswordMatch] = useState<boolean>(false);
  const changePasswordSchema = Yup.object().shape({
    emailAddress: Yup.string().required("*This Field Is Required."),
    oldPassword: Yup.string().required("*Old Password Is Required."),
    newPassword: Yup.string()
      .required("*New Password Is Required")
      .min(8, "*Password Must Contain 8-24 Characters.")
      .max(24, "*Password Must Contain 8-24 Characters.")
      .matches(
        /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[~!@#$%^&*_\-+=`|\\(){}[\]:;"'<>,.?/])[A-Za-z\d~!@#$%^&*_\-+=`|\\(){}[\]:;"'<>,.?/]+$/,
        "Password Must Contain At Least 8 Characters Including At Least One Uppercase, One Lowercase, One Number And One Special Case Character.Blank Spaces Are Not Allowed."
      ),
    confirmPassword: Yup.string()
      .required("*Confirm Password Is Required.")
      .oneOf([Yup.ref("newPassword")], "Passwords Do Not Match."),
  });

  const formik = useFormik({
    initialValues: {
      emailAddress: userData?.emailAddress,
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validateOnMount: true,
    validationSchema: changePasswordSchema,
    onSubmit: async (values) => {},
  });
  const handleCrossClick = () => {
    formik.resetForm();
    props?.onHide();
  };

  const updatePasswordFunction = async (e: any) => {
    try {
      e.preventDefault();
      const result: updatePasswordResponse = await updatePassword({
        emailAddress: userData?.emailAddress,
        oldPassword: formik.values.oldPassword,
        newPassword: formik.values.newPassword,
        confirmPassword: formik.values.confirmPassword,
      });

      if (result?.status === 200) {
        formik.resetForm();
        props?.onHide();
        handleLogout(navigate, userData);
      } else  {
        formik.resetForm();
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (formik.values.newPassword === formik.values.confirmPassword) {
      setIsPasswordMatch(true);
    } else {
      setIsPasswordMatch(false);
    }
  }, [formik.values]);

  return (
    <>
      <CommonModal
        heading="Change Password"
        show={props?.show}
        onHide={handleCrossClick}
        className="change-modal"
        crossBtn
      >
        <div className="change-modal-inner">
          <Password
            label={
              <>
                Old Password<sup>*</sup>
              </>
            }
            placeholder="Enter your Old Password"
            id="oldPassword"
            name="oldPassword"
            rightIcon={<CloseEye />}
            type="text"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.oldPassword}
            error={
              formik.errors.oldPassword && formik.touched.oldPassword ? (
                <span className="error-message">
                  {formik.errors.oldPassword}
                </span>
              ) : null
            }
          />
          <Password
            label={
              <>
                New Password<sup>*</sup>
              </>
            }
            placeholder="Enter your New Password"
            rightIcon={<CloseEye />}
            id="newPassword"
            name="newPassword"
            type="text"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.newPassword}
            error={
              formik.errors.newPassword && formik.touched.newPassword ? (
                <span className="error-message">
                  {formik.errors.newPassword}
                </span>
              ) : null
            }
          />
          <Password
            label={
              <>
                Confirm New Password<sup>*</sup>
              </>
            }
            placeholder="Confirm your Password"
            id="confirmPassword"
            name="confirmPassword"
            type="text"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.confirmPassword}
            rightIcon={EyeIcon}
            error={
              formik.errors.confirmPassword &&
              formik.touched.confirmPassword ? (
                <span className="error-message">
                  {formik.errors.confirmPassword}
                </span>
              ) : null
            }
            disablePaste={true}
          />

          <ButtonCustom
            title="Change Password"
            type="submit"
            className="mw-100"
            onClick={(e: any) => updatePasswordFunction(e)}
            disabled={!(formik.isValid && isPasswordMatch)}
          />
        </div>
      </CommonModal>
    </>
  );
};

export default ChangePassword;
