import GoogleLogin from "react-google-login";
import Router from "next/router";

import { loginWithGoogle } from "../../actions/auth";
import { useAuth } from "../../actions/AuthProvider";

const LoginGoogle = () => {
  const { authenticate } = useAuth();

  const responseGoogle = (response) => {
    const tokenId = response.tokenId;
    const token = { tokenId };

    loginWithGoogle(token).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        authenticate(data, () => {
          Router.push(`/user`);
        });
      }
    });
  };

  return (
    <div>
      <GoogleLogin
        clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}
        buttonText="Login with google"
        onSuccess={responseGoogle}
        onFailure={responseGoogle}
        theme="dark"
      />
    </div>
  );
};

export default LoginGoogle;
