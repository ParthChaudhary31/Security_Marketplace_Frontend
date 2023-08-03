import React from 'react';
import scan from "../../../Assets/Images/scanner.png"
import styles from "./TFA.module.scss";
import { Col, Container, Row } from 'react-bootstrap';
import InputCustom from '../Inputs/InputCustom';
import ButtonCustom from '../Button/ButtonCustom';
import { CopyIcon } from '../../../Assets/Images/Icons/SvgIcons';

const TFA = () => {
    return (
        <>
            <section className={styles.tfa_sec}>
                <Container>
                    <Row>
                        <Col>
                            <div className={styles.tfa_sec_inner}>
                                <h2>2FA</h2>
                                <p className='text-dark'>Please activate 2FA first then you will be able to activate your wallet</p>
                                <div className={styles.img}>
                                    <img src={scan} alt="scan_img" />
                                </div>
                                <h4>Scan QR code to enable 2FA <br /> Or <br /> Enter the private key manually</h4>
                                <div className='mt-3 text-center'>
                                    <InputCustom placeholder="Enter your address" rightIcon={<>{CopyIcon}</>} className="mt-5" />
                                    <InputCustom placeholder="Enter OTP" />
                                    <ButtonCustom title="Verify" className={styles.verify_btn} />
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>
        </>
    );
};

export default TFA;