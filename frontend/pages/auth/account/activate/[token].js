import { useState, useEffect } from "react";
import useTranslation from "next-translate/useTranslation";
import { withRouter } from "next/router";

import Layout from "@components/Layout";
import { signup } from "@actions/auth";

const ActivateAccount = ({ router }) => {
  let { t } = useTranslation("common");

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

  const showLoading = () => (loading ? <h2>...</h2> : "");

  return (
    <Layout footer={false} breadcrumbs={false}>
      <div className="container pt-5">
        {showLoading()}
        {error && error}
        {success &&
          t("You have successfully activated your account. Please signin.")}
        {showButton && (
          <button className="btn btn-outline-primary" onClick={clickSubmit}>
            {t("Activate Account")}
          </button>
        )}
      </div>
    </Layout>
  );
};

export const getStaticPaths = async () => {
  return {
    paths: [], //indicates that no page needs be created at build time
    fallback: "blocking", //indicates the type of fallback
  };
};

export default withRouter(ActivateAccount);
