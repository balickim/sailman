import { useState } from "react";
import useTranslation from "next-translate/useTranslation";

import Layout from "@components/Layout";
import { forgotPassword } from "@actions/auth";

const ForgotPassword = () => {
  let { t } = useTranslation("common");

  const [values, setValues] = useState({
    email: "",
    message: "",
    error: "",
  });

  const { email, message, error } = values;

  const handleChange = (name) => (e) => {
    setValues({ ...values, message: "", error: "", [name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setValues({ ...values, message: "", error: "" });
    forgotPassword({ email }).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({
          ...values,
          message: t(
            "Password reset email sent successfully. Expires in 10 minutes."
          ),
          email: "",
        });
      }
    });
  };

  const showError = () =>
    error ? <div className="alert alert-danger">{error}</div> : "";
  const showMessage = () =>
    message ? <div className="alert alert-success">{message}</div> : "";

  const passwordForgotForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="form-group pt-5">
        <input
          type="email"
          onChange={handleChange("email")}
          className="form-control"
          value={email}
          placeholder={t("E-mail")}
          required
        />
      </div>
      <div>
        <button className="btn btn-primary">{t("Submit")}</button>
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
        {passwordForgotForm()}
      </div>
    </Layout>
  );
};

export default ForgotPassword;
