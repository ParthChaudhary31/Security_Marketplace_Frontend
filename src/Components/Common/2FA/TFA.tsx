import { Dispatch, useEffect, useState } from "react";
import styles from "./TFA.module.scss";
import { Col, Container, Row } from "react-bootstrap";
import InputCustom from "../Inputs/InputCustom";
import OtpInput from "react-otp-input";
import { CopyIcon } from "../../../Assets/Images/Icons/SvgIcons";
import ButtonCustom from "../Button/ButtonCustom";
import { useDispatch, useSelector } from "react-redux";
import {
  TwoFA,
  disableTwoFactor,
  verifytwoFactor,
} from "../../../Api/Actions/user.action";
import useCopyClipboard from "../../../hooks/useCopyToClipboard";
import { setTwoFactorStatus } from "../../../Redux/2FA/TwoFA.slice";

const TFA = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [otp, setOtp] = useState<string>("");
  const [isInputFilled, setIsInputFilled] = useState(false);

  const [copySuccess, setCopySuccess] = useState(false);
  const dispatch: Dispatch<any> = useDispatch();
  const [copyToClipboard] = useCopyClipboard();
  const [twoFA, setTwoFA] = useState<any>({
    twoFAimage: "",
    secret: "",
  });
  const twoFaStatus = useSelector((state: any) => state.TwoFactor?.twoFaStatus);

  const emailAddress = useSelector(
    (state: any) => state?.userDataSlice?.emailAddress
  );
  const twoFactorAuthantication = async () => {
    const result: any = await TwoFA(emailAddress);
    if (result?.status === 200) {
      setTwoFA({
        twoFAimage: result?.data?.qrImgUrl,
        secret: result?.data?.secret,
      });
    }
  };

  const twoFactorVerify = async () => {
    const secret = twoFA?.secret;
    setLoading(true);
    try {
      const result = await verifytwoFactor(secret, otp, emailAddress);
      setOtp("");
      if (result?.status === 200) {
        dispatch(setTwoFactorStatus(result?.twoFactorAuthenticationStatus));
      }
    } catch (error) {
      console.error("Verification Error:", error);
    } finally {
      setLoading(false);
      setIsInputFilled(false);
    }
  };

  const handlDisable2FA = async () => {
    setLoading(true);
    try {
      const result: any = await disableTwoFactor(otp, emailAddress);
      setOtp("");
      if (result?.status === 200) {
        dispatch(setTwoFactorStatus(false));
      }
    } catch (error) {
      console.error("API Error:", error);
    } finally {
      setLoading(false);
      setIsInputFilled(false);
    }
  };
  useEffect(() => {
    if (copySuccess) {
      const timeoutId = setTimeout(() => {
        setCopySuccess(false);
      }, 2000);
      return () => clearTimeout(timeoutId);
    }
  }, [copySuccess]);

  useEffect(() => {
    if (!twoFaStatus) {
      twoFactorAuthantication();
    }
  }, [twoFaStatus]);

  return (
    <>
      <section className={styles.tfa_sec}>
        <Container>
          <Row>
            <Col>
              <div className={styles.tfa_sec_inner}>
                {!twoFaStatus ? (
                  <>
                    <h2>2-Factor Authentication</h2>
                    <div className={styles.img}>
                      <img src={twoFA?.twoFAimage} alt="scan_img" />{" "}
                    </div>
                    <p>
                      Install Google Authenticator (App OR Extension) and then
                      enable 2FA.
                    </p>
                    <h4>
                      Scan QR code to enable 2FA <br /> Or <br /> Enter the
                      private key manually
                    </h4>
                    <div className={styles.otp}>
                      <div className={styles.otp_sec}>
                        <div className="position-relative">
                          <InputCustom
                            disabled
                            type="text"
                            placeholder={twoFA?.secret}
                            className="mt-5"
                            rightIcon={
                              <>
                                <span
                                  className={styles.copy_btn}
                                  onClick={() => {
                                    copyToClipboard(twoFA?.secret);
                                    setCopySuccess(true);
                                  }}
                                >
                                  <CopyIcon />
                                </span>{" "}
                              </>
                            }
                          />
                          <span className={styles.copy_success}>
                            {copySuccess && "Copied!"}
                          </span>
                        </div>
                        <OtpInput
                          value={otp}
                          onChange={(otpValue) => {
                            setOtp(otpValue);
                            setIsInputFilled(otpValue.length === 6);
                          }}
                          numInputs={6}
                          renderSeparator={<span>-</span>}
                          renderInput={(props) => <input {...props} />}
                          inputStyle="otp_block"
                          inputType="number"
                        />
                      </div>
                      <div className={styles.button_sections}>
                        <ButtonCustom
                          title={loading ? "Verifying" : "Enable 2FA"}
                          className={styles.verify_btn}
                          onClick={twoFactorVerify}
                          disabled={!isInputFilled}
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <div className={styles.otp}>
                    <h2>Disable 2FA</h2>
                    <div className={styles.otp_sec}>
                      <OtpInput
                        value={otp}
                        onChange={(otpValue) => {
                          setOtp(otpValue);
                          setIsInputFilled(otpValue.length === 6);
                        }}
                        numInputs={6}
                        inputType="number"
                        renderSeparator={<span>-</span>}
                        renderInput={(props) => <input {...props} />}
                        inputStyle="otp_block"
                      />
                    </div>
                    <div className={styles.button_sections}>
                      <ButtonCustom
                        title={loading ? "Verifying" : "Disable 2FA"}
                        className={styles.verify_btn}
                        onClick={handlDisable2FA}
                        disabled={!isInputFilled}
                      />
                    </div>
                  </div>
                )}
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default TFA;
