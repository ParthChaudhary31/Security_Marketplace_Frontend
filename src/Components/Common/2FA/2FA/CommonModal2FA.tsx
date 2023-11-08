import { Dispatch, useState } from "react";
import "./CommonModal2FA.scss";
import ButtonCustom from "../../Button/ButtonCustom";
import { useDispatch, useSelector } from "react-redux";
import { logintwoFactorAuthentication } from "../../../../Api/Actions/user.action";
import { useNavigate } from "react-router-dom";
import CommonModal from "../../CommonModal/CommonModal";
import OtpInput from "react-otp-input";
import store from "../../../../Redux/store";
import { setJwtToken } from "../../../../Redux/authenticationData/authenticationData";
import { reset } from "../../../../Redux/2FA/TwoFA.slice";

const CommonModal2FA = (props) => {
  const [otp, setOtp] = useState<string>("");
  const [isInputFilled, setIsInputFilled] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const dispatch: Dispatch<any> = useDispatch();

  const emailAddress = useSelector(
    (state: any) => state?.userDataSlice?.emailAddress
  );

  const handle2FASubmit = async () => {
    setLoading(true);
    try {
      const result: any = await logintwoFactorAuthentication(otp, emailAddress);
      setOtp("");
      if (result?.status === 200) {
        navigate("/admin/dashboard");
      }
    } catch (error) {
      console.error("API Error:", error);
    } finally {
      setLoading(false);
      setIsInputFilled(false);
    }
  };

  const handleClose = async () => {
    setOtp("");
    store.dispatch(setJwtToken(""));
    dispatch(reset());
  };

  return (
    <>
      <CommonModal
        show={props?.show}
        onHide={() => {
          props?.onHide();
          handleClose();
        }}
        className="tfa_modal"
        heading="Verify 2FA"
        crossBtn
      >
        <div className="otp_sec">
          <OtpInput
            value={otp}
            placeholder="Enter 6 digit OTP"
            onChange={(otpValue) => {
              setOtp(otpValue);
              setIsInputFilled(otpValue.length === 6);
            }}
            numInputs={6}
            renderSeparator={<span>-</span>}
            inputType="number"
            renderInput={(props) => <input {...props} />}
            inputStyle={{
              fontSize: "2.2rem",
              color: "black",
            }}
          />
        </div>
        <div className="otp">
          <div className="button_sections text-center">
            <ButtonCustom
              title={loading ? "Verifying" : "Verify 2FA"}
              className="verify_btn"
              onClick={handle2FASubmit}
              disabled={!isInputFilled}
            />
          </div>
        </div>
      </CommonModal>
    </>
  );
};

export default CommonModal2FA;
