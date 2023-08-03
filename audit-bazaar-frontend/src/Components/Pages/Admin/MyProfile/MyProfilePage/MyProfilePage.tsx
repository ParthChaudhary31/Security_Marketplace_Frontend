import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
import './MyProfilePage.scss'
import { Link } from 'react-router-dom'
import BackButton from '../../../../Common/BackButton/BackButton'
import ButtonCustom from '../../../../Common/Button/ButtonCustom'
import DashboardListing from '../../Dashboard/DashboardListing/DashboardListing'
import defaultUserIcon from '../../../../../Assets/Images/defaultUserIcon.png'


const MyProfilePage = () => {

    return (
        <div className='profile_page'>
            <Container fluid>
                <BackButton />
                <Row>
                    <Col md={12} lg={6} xl={6}>
                        <DashboardListing />
                    </Col>
                    <Col md={12} lg={6} xl={6}>
                        <div className="dashboard_card">
                            <Link to="/admin/dashboard-listing"><ButtonCustom className="dashboard_card_btn" title="View Request" /></Link>
                            <div className="dashboard_card_inner">
                                <div className="dashboard_card_inner_header">
                                    <span className="token_icon">
                                        <img src={defaultUserIcon} alt="" />
                                    </span>
                                    <div className="user_id">
                                        <h4>Maria Cooper</h4>
                                        <p>maria119@gmail.com</p>
                                    </div>
                                </div>
                                <div className="dashboard_card_inner_body">
                                    <h6>Posted On: 13-06-2023</h6>
                                </div>
                            </div>

                            <h6>Propost Details</h6>
                            <div className='dashboardList_data_value'>
                                <ul>
                                    <li>
                                        <h4>Amount</h4>
                                        <p>10K usd</p>
                                    </li>
                                    <li>
                                        <h4>Expected Timeline</h4>
                                        <p>20 Days</p>
                                    </li>
                                    <li>
                                        <h4>Gitlab URL</h4>
                                        <p>www.audirbaazar.com</p>
                                    </li>
                                </ul>
                            </div>
                            <div className='viewCard_btn'>
                                <ButtonCustom
                                    title="Decline"
                                    type="submit"
                                    className="red_border bordered"
                                    onClick={() => {}}
                                />
                                <ButtonCustom
                                    title="Accept"
                                    type="submit"
                                    className="green_bg"
                                    onClick={() => {}}
                                />
                            </div>
                        </div>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default MyProfilePage
