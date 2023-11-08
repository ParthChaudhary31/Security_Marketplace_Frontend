import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import './Message.scss'
import DashboardListing from '../Dashboard/DashboardListing/DashboardListing'
import message_img from '../../../../Assets/Images/meassage-img.svg'
import BackButton from '../../../Common/BackButton/BackButton'

const Message = () => {
    return (
        <section className="Message">
            <Container fluid>
                <div className='Message_box'>
                    <BackButton/>
                    <Row>
                        <Col lg={12} xl={7}>
                            <DashboardListing className="message_list" />
                        </Col>
                        <Col lg={12} xl={5}>
                            <div className="Message_box_detail">
                                <div className='Message_box_detail_info'>
                                    <div className='message_image'>
                                        <img src={message_img} alt="list-img" />
                                    </div>
                                    <div className='list_content'>
                                        <h6>Bradley Cooper</h6>
                                        <p className='user_email'>June 3, 2023 at 09:47 PM</p>
                                    </div>
                                </div>
                                <p>
                                    It is a long established fact that a reader will be distracted by the readable content of a page
                                    when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal
                                    distribution of letters, as opposed to using 'Content here, content here', making it look like readable English.
                                    Many desktop publishing packages and web page It is a long established fact that a reader will be distracted by the
                                    readable content
                                </p>
                            </div>
                            <div className="Message_box_detail">
                                <div className='Message_box_detail_info'>
                                    <div className='message_image'>
                                        <img src={message_img} alt="list-img" />
                                    </div>
                                    <div className='list_content'>
                                        <h6>Bradley Cooper</h6>
                                        <p className='user_email'>June 3, 2023 at 09:47 PM</p>
                                    </div>
                                </div>
                                <p>
                                    It is a long established fact that a reader will be distracted by the readable content of a page
                                    when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal
                                    distribution of letters, as opposed to using 'Content here, content here', making it look like readable English.
                                    Many desktop publishing packages and web page It is a long established fact that a reader will be distracted by the
                                    readable content
                                </p>
                            </div>
                        </Col>
                    </Row>
                </div>
            </Container>
        </section>
    )
}

export default Message
