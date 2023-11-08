import React from 'react';
import no_data from "../../../Assets/Images/micro.png";
import "./NoDataFound.scss";

const NoPostFound = () => {
    return (
        <>
            <div className='no_data'>
                <img src={no_data} alt="data_img" />
                <p>No Post Available</p>
            </div>
        </>
    );
};

export default NoPostFound;