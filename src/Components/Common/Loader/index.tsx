import React from "react";
import { Triangle } from "react-loader-spinner";
import "./style.scss";

const Loader = ({ isLoading }) => {
  return (
    isLoading && (
      <div className="overlayloader">
        <Triangle
          height="80"
          width="80"
          color="#fff"
          ariaLabel="triangle-loading"
          wrapperStyle={{}}
          wrapperClass="loaderColor"
          visible={true}
        />
      </div>
    )
  );
};

export default Loader;
