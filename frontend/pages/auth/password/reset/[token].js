import { useState } from "react";
import { withRouter } from "next/router";
import useTranslation from "next-translate/useTranslation";

import Layout from "@components/Layout";
import { resetPassword } from "@actions/auth";

const ResetPassword = ({ router }) => {
  let { t } = useTranslation("common");

  const [values, setValues] = useState({
    name: "",
    newPassword: "",
    error: "",
    message: "",
  });

  const { name, newPassword, error, message } = values;

  const handleSubmit = (e) => {
    e.preventDefault();
    resetPassword({
      newPassword,
      resetPasswordLink: router.query.token,
    }).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error, newPassword: "" });
        setTimeout(router.push("/auth/password/forgot"), 3000);
      } else {
        setValues({
          ...values,
          message: data.message,
          newPassword: "",
          error: false,
        });
      }
    });
  };

  const showError = () =>
    error ? <div className="alert alert-danger">{error}</div> : "";
  const showMessage = () =>
    message ? <div className="alert alert-success">{message}</div> : "";

  const passwordResetForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="form-group pt-5">
        <input
          type="password"
          onChange={(e) =>
            setValues({ ...values, newPassword: e.target.value })
          }
          className="form-control"
          value={newPassword}
          placeholder={t("new password")}
          required
        />
      </div>
      <div>
        <button className="btn btn-primary">{t("Change password")}</button>
      </div>
    </form>
  );

  return (
    <Layout>
      <div className="container mt-4">
        <h2>{t("Password reset")}</h2>
        <hr />
        {showError()}
        {showMessage()}
        {passwordResetForm()}
      </div>
    </Layout>
  );
};

export const getServerSideProps = async () => {
  return {
    props: {},
  };
};

export default withRouter(ResetPassword);
