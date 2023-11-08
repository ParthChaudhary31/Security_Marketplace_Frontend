import React, { memo } from "react";
import "./Shimmer.scss";

const Shimmer = ({
  width,
  height,
  fluid,
  verticlyFluid,
  className,
}: {
  className?: string;
  width?: number;
  height?: number;
  fluid?: boolean;
  verticlyFluid?: boolean;
}) => {
  return (
    <>
      <span
        style={{
          width: fluid ? "100%" : width ? `${width}px` : "400px",
          height: verticlyFluid ? "100%" : height ? `${height}px` : "40px",
        }}
        className={`shimmer ${className}`}
      ></span>
    </>
  );
};

export default memo(Shimmer);
