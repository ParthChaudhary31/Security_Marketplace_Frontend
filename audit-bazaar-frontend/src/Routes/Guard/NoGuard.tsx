import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

/** FOR PAGES THAT DON'T REQUIRE AUTHENTICATION */
export const WithoutAuth = (props: any) => {
  const walletDetails = useSelector(
    (state: any) => state?.authenticationDataSlice?.walletAddress
  );
  return !walletDetails?.walletAddress ? (
    props.children
  ) : (
    <Navigate to="/admin/dashboard" />
  );
};
