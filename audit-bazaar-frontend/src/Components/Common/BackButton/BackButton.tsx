import React from 'react'
import './BackButton.scss';
import back_arrow from '../../../Assets/Images/Icons/back-arrow.svg'

const BackButton = () => {
    return (
        <div className="backIcon">
            <span>
                <img src={back_arrow} alt="back-arrow" />
            </span>
            <p>Back</p>
        </div>
    )
}

export default BackButton
