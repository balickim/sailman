import { useState } from "react";
import { withRouter } from "next/router";

import Layout from "../../../../components/Layout";
import { resetPassword } from "../../../../actions/auth";

const ResetPassword = ({ router }) => {
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
          placeholder="new password"
          required
        />
      </div>
      <div>
        <button className="btn btn-primary">Change password</button>
      </div>
    </form>
  );

  return (
    <Layout>
      <div className="container">
        <h2>Change password</h2>
        <hr />
        {showError()}
        {showMessage()}
        {passwordResetForm()}
      </div>
    </Layout>
  );
};

export default withRouter(ResetPassword);
