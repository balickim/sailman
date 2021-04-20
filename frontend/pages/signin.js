import Layout from "../components/Layout";
import SigninComponent from "../components/auth/SigninComponent";

const Signin = () => {
  const showRedirectMessage = () => {
    if (window?.location.search) {
      return (
        <div className="alert alert-danger">
          {window.location.search.substring(9)}
        </div>
      );
    } else {
      return;
    }
  };
  return (
    <>
      <Layout>
        <div className="row">
          <div className="col-md-6 offset-md-3">{showRedirectMessage()}</div>
        </div>
        <div className="row">
          <div className="col-md-6 offset-md-3">
            <SigninComponent />
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Signin;
