import Image from 'next/image';
import { useRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import { useState } from 'react';

import { sendFeedback } from '@actions/form';

const FeedbackForm = () => {
  const [values, setValues] = useState({
    value: -1,
    message: '',
    showForm: false,
    sent: false,
    success: '',
    error: '',
  });

  const { locale } = useRouter();
  const router = useRouter();

  const { value, message, success, error } = values;

  let { t } = useTranslation('common');

  const feedbackSubmit = e => {
    e.preventDefault();
    sendFeedback({
      value,
      message,
      pathname: `${locale}${router.pathname}`,
    }).then(data => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({
          ...values,
          sent: true,
          success: 'Feedback sent. Thank you!',
        });
      }
    });
  };

  const handleChange = e => {
    setValues({
      ...values,
      message: e.target.value,
      sent: false,
    });
  };

  const showError = () => (
    <div className="alert alert-danger" style={{ display: error ? '' : 'none' }}>
      {error}
    </div>
  );

  const showSuccess = () => (
    <div className="alert alert-success" style={{ display: success ? '' : 'none' }}>
      {success}
    </div>
  );

  const feedbackForm = () => (
    <form onSubmit={feedbackSubmit}>
      <div className="d-flex justify-content-center">
        <button
          className={`btn btn-secondary m-1`}
          onClick={() => {
            setValues({
              ...values,
              value: 1,
            });
          }}>
          <Image src="/images/sad_smiley_yellow_simple.svg" height={60} width={60} />
        </button>
        <button
          className={`btn btn-secondary m-1`}
          onClick={() => {
            setValues({
              ...values,
              value: 2,
            });
          }}>
          <Image src="/images/plain_smiley_yellow_simple.svg" height={60} width={60} />
        </button>
        <button
          className={`btn btn-secondary m-1`}
          onClick={() => {
            setValues({
              ...values,
              value: 3,
            });
          }}>
          <Image src="/images/smiling_smiley_yellow_simple.svg" height={60} width={60} />
        </button>
      </div>
      <div className="row">
        <div className="col-md-8">
          <input
            type="textarea"
            className="form-control"
            placeholder={t('feedback_msg')}
            value={message}
            onChange={handleChange}
          />
        </div>

        <div className="col-md-4">
          <button className="btn btn-block btn-secondary" type="submit">
            {t('Submit')}
          </button>
        </div>
      </div>
    </form>
  );

  return (
    <>
      <button
        className="btn btn-info float-end"
        type="button"
        onClick={() => {
          setValues({
            ...values,
            showForm: !values.showForm,
          });
        }}>
        {t('Feedback')}
      </button>
      {values.showForm && (
        <div className="container">
          <div className="border border-info p-3 m-5 bg-white">
            <div style={{ marginTop: '30px' }}>{feedbackForm()}</div>
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
