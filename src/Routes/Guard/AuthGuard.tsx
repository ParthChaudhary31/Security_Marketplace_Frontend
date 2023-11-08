import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

/**AUTHGAURD FOR INNER PAGES */
export const RequireAuth = (props: any) => {
  const accessToken = useSelector(
    (state: any) => state?.authenticationDataSlice?.jwtToken
  );
  return accessToken ? props?.children : <Navigate to="/" />;
};
