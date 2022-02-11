import { useState } from 'react';
import useTranslation from 'next-translate/useTranslation';

import Layout from '@components/layout/Layout';
import { forgotPassword } from '@http/auth.resource';

const ForgotPassword = () => {
  let { t } = useTranslation('common');

  const [values, setValues] = useState({
    email: '',
    message: '',
    error: '',
  });

  const { email, message, error } = values;

  const handleChange = name => e => {
    setValues({ ...values, message: '', error: '', [name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    setValues({ ...values, message: '', error: '' });
    forgotPassword({ email }).then(data => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({
          ...values,
          message: t('notification.email_reset_sent'),
          email: '',
        });
      }
    });
  };

  const showError = () => (error ? <div className="alert alert-danger">{error}</div> : '');
  const showMessage = () => (message ? <div className="alert alert-success">{message}</div> : '');

  const passwordForgotForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="form-group pt-2">
        <input
          type="email"
          onChange={handleChange('email')}
          className="form-control"
          value={email}
          placeholder={t('email')}
          required
        />
      </div>
      <div>
        <button className="btn btn-primary mt-3">{t('action.submit')}</button>
      </div>
    </form>
  );

  return (
    <Layout breadcrumbs={false} footer={false}>
      <div className="container mt-4">
        <h2>{t('password_reset')}</h2>
        <hr />
        {showError()}
        {showMessage()}
        {passwordForgotForm()}
      </div>
    </Layout>
  );
};

export default ForgotPassword;
