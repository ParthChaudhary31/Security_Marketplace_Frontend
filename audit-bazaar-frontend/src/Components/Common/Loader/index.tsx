import { Triangle } from "react-loader-spinner";
import { useSelector } from "react-redux";
import "./style.scss";

/**LOADER COMPONENTS */
const Loader = () => {
  /**GET STATES FROM STORE */
  const isLoading = useSelector((state: any) => state?.LoaderSlice?.isLoading);
  /**IF isLoading IS TRUE SHOW LOADER*/
  if (isLoading) {
    return (
      <div className="overlayloader">
        <Triangle
          height="80"
          width="80"
          color="#fff"
          ariaLabel="triangle-loading"
          wrapperStyle={{}}
          wrapperClass="something"
          visible={true}
        />
      </div>
    );
  } else {
    return <></>;
};
}
export default Loader;
