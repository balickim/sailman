import Layout from "../components/Layout";
import { withRouter } from "next/router";
import SigninComponent from "../components/auth/SigninComponent";

const Signin = ({ router }) => {
  const showRedirectMessage = () => {
    if (router.query.message) {
      return (
        <div className="alert alert-danger mt-5">{router.query.message}</div>
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

export const getStaticProps = async () => {
  return {
    props: {},
  };
};

export default withRouter(Signin);
