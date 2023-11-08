import React from 'react';
import "./ViewRequestModal.scss";
import CommonModal from '../CommonModal/CommonModal';

const ViewRequestModal = ({ show, onHide }) => {
    return (
        <>
            <CommonModal show={show} onHide={onHide} className="view_modal" heading="Audit ID: 123">
                <ul className='view_modal_inner'>
                    <li>
                        <p>FILE.pdf</p>
                        <p>Uploaded</p>
                    </li>
                    <li>
                        <p>FILE.pdf</p>
                        <p>Uploaded</p>
                    </li>
                    <li>
                        <p>FILE.pdf</p>
                        <p>Uploaded</p>
                    </li>
                    <li>
                        <p>FILE.pdf</p>
                        <p>Uploaded</p>
                    </li>
                </ul>
            </CommonModal>
        </>
    );
};

export default ViewRequestModal;