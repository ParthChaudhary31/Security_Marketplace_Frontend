import { useSelector } from "react-redux";

const parseJwt = (token:any) => {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (e) {
    return null;
  }
};

const authVerify = (props) => {
  const jwt = useSelector(
    (state: any) => state?.authenticationDataSlice?.jwtToken
  );
  if (jwt) {
    const decodedJwt = parseJwt(jwt);

    if (decodedJwt.exp * 1000 < Date.now()) {
      props?.logout();
    }
  }

  return <div></div>;
};

export default authVerify;
