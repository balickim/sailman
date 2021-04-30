import { useState, useEffect } from "react";
import { withRouter } from "next/router";

import Layout from "@components/Layout";
import { signup } from "@actions/auth";

const ActivateAccount = ({ router }) => {
  const [values, setValues] = useState({
    token: "",
    error: "",
    loading: false,
    success: false,
    showButton: true,
  });

  const { token, error, loading, success, showButton } = values;

  useEffect(() => {
    let token = router.query.token;
    if (token) {
      setValues({ ...values, token });
    }
  }, [router]);

  const clickSubmit = (e) => {
    e.preventDefault();
    setValues({ ...values, loading: true, error: false });
    signup({ token }).then((data) => {
      if (data.error) {
        setValues({
          ...values,
          error: data.error,
          loading: false,
          showButton: false,
        });
      } else {
        setValues({
          ...values,
          loading: false,
          success: true,
          showButton: false,
        });
      }
    });
  };

  const showLoading = () => (loading ? <h2>Loading...</h2> : "");

  return (
    <Layout>
      <div className="container">
        {showLoading()}
        {error && error}
        {success &&
          "You have successfully activated your account. Please signin."}
        {showButton && (
          <button className="btn btn-outline-primary" onClick={clickSubmit}>
            Activate Account
          </button>
        )}
      </div>
    </Layout>
  );
};

export default withRouter(ActivateAccount);
