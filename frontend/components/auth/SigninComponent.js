import Router from "next/router";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import { useState, useEffect } from "react";
import { MDBSpinner } from "mdb-react-ui-kit";

import { useAuth } from "@components/auth/AuthProvider";
import { signin } from "@actions/auth";
import LoginGoogle from "@components/auth/LoginGoogle";

const SigninComponent = () => {
  let { t } = useTranslation("common");

  const [values, setValues] = useState({
    email: "",
    password: "",
    error: "",
    loading: false,
    message: "",
    showForm: true,
  });

  const { email, password, error, loading, message, showForm } = values;

  const { authenticate, user } = useAuth();

  useEffect(() => {
    user && Router.push(`/`);
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setValues({ ...values, loading: true, error: false });
    const user = { email, password };

    signin(user).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error, loading: false });
      } else {
        authenticate(data, () => {
          Router.push("/");
        });
      }
    });
  };

  const handleChange = (name) => (e) => {
    setValues({ ...values, error: false, [name]: e.target.value });
  };

  const showLoading = () =>
    loading ? (
      <div className="text-center">
        <MDBSpinner color="primary" />
      </div>
    ) : (
      ""
    );
  const showError = () =>
    error ? <div className="alert alert-danger text-center">{error}</div> : "";
  const showMessage = () =>
    message ? (
      <div className="alert alert-info text-center">{message}</div>
    ) : (
      ""
    );

  const signinForm = () => {
    return (
      <>
        <h2 className="text-center pt-4 pb-4">{t("Signin")}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              value={email}
              onChange={handleChange("email")}
              type="email"
              className="form-control"
              placeholder={t("E-mail")}
            ></input>
          </div>
          <div className="form-group">
            <input
              value={password}
              onChange={handleChange("password")}
              type="password"
              className="form-control"
              placeholder={t("Password")}
            ></input>
          </div>
          <div className="pt-2">
            <button className="btn btn-primary">{t("Signin")}</button>
          </div>
          <div>
            <Link href="/auth/password/forgot">
              <a>{t("forgot password")}</a>
            </Link>
          </div>
        </form>
      </>
    );
  };
  return (
    <>
      {showError()}
      {showMessage()}
      {showForm && signinForm()}
      <hr />
      <h2>{t("OR")}</h2>
      <hr />
      <LoginGoogle buttonText={t("Login with Google")} />
      {showLoading()}
    </>
  );
};

export default SigninComponent;
