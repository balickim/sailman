import Image from "next/image";
import { useRouter } from "next/router";

import { useState } from "react";

import { sendFeedback } from "../../actions/form";

const FeedbackForm = () => {
  const [values, setValues] = useState({
    value: -1,
    message: "",
    showForm: false,
    sent: false,
    success: "",
    error: "",
  });

  const router = useRouter();

  const { value, message, success, error } = values;

  const feedbackSubmit = (e) => {
    e.preventDefault();
    sendFeedback({ value, message, pathname: router.pathname }).then((data) => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({
          ...values,
          sent: true,
          success: "Feedback sent. Thank you!",
        });
      }
    });
  };

  const handleChange = (e) => {
    setValues({
      ...values,
      message: e.target.value,
      sent: false,
    });
  };

  const showError = () => (
    <div
      className="alert alert-danger"
      style={{ display: error ? "" : "none" }}
    >
      {error}
    </div>
  );

  const showSuccess = () => (
    <div
      className="alert alert-success"
      style={{ display: success ? "" : "none" }}
    >
      {success}
    </div>
  );

  const feedbackForm = () => (
    <form onSubmit={feedbackSubmit}>
      <div className="row">
        <div className="col-md-8">
          <input
            type="textarea"
            className="form-control"
            placeholder="(Optional) What should we change?"
            value={message}
            onChange={handleChange}
          />
        </div>

        <div className="col-md-4">
          <button className="btn btn-block btn-outline-primary" type="submit">
            Submit
          </button>
        </div>
      </div>
    </form>
  );

  return (
    <>
      <button
        className="btn btn-info float-right"
        type="button"
        onClick={() => {
          setValues({
            ...values,
            showForm: !values.showForm,
          });
        }}
      >
        Feedback
      </button>
      {values.showForm && (
        <div className="container-fluid">
          <div className="border border-info p-3 m-5">
            <div className="d-flex justify-content-center">
              <a
                className={`btn btn-light m-1`}
                type="button"
                onClick={() => {
                  setValues({
                    ...values,
                    value: 1,
                  });
                }}
              >
                <Image
                  src="/images/sad_smiley_yellow_simple.svg"
                  height={60}
                  width={60}
                />
              </a>
              <a
                className={`btn btn-light m-1`}
                type="button"
                onClick={() => {
                  setValues({
                    ...values,
                    value: 2,
                  });
                }}
              >
                <Image
                  src="/images/plain_smiley_yellow_simple.svg"
                  height={60}
                  width={60}
                />
              </a>
              <a
                className={`btn btn-light m-1`}
                type="button"
                onClick={() => {
                  setValues({
                    ...values,
                    value: 3,
                  });
                }}
              >
                <Image
                  src="/images/smiling_smiley_yellow_simple.svg"
                  height={60}
                  width={60}
                />
              </a>
            </div>

            <div style={{ marginTop: "30px" }}>{feedbackForm()}</div>
            {values.sent && (
              <div className="pt-3">
                {showError()}
                {showSuccess()}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default FeedbackForm;
