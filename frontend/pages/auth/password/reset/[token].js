import { useState } from 'react';
import { withRouter } from 'next/router';
import useTranslation from 'next-translate/useTranslation';

import Layout from '@components/layout/Layout';
import { resetPassword } from '@actions/auth';

const ResetPassword = ({ router }) => {
  let { t } = useTranslation('common');

  const [values, setValues] = useState({
    newPassword: '',
    error: '',
    message: '',
  });

  const { newPassword, error, message } = values;

  const handleSubmit = e => {
    e.preventDefault();
    resetPassword({
      newPassword,
      resetPasswordLink: router.query.token,
    }).then(data => {
      if (data.error) {
        setValues({ ...values, error: data.error, newPassword: '' });
        setTimeout(router.push('/auth/password/forgot'), 3000);
      } else {
        setValues({
          ...values,
          message: data.message,
          newPassword: '',
          error: false,
        });
      }
    });
  };

  const showError = () => (error ? <div className="alert alert-danger">{error}</div> : '');
  const showMessage = () => (message ? <div className="alert alert-success">{message}</div> : '');

  const passwordResetForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="form-group pt-2">
        <input
          type="password"
          onChange={e => setValues({ ...values, newPassword: e.target.value })}
          className="form-control"
          value={newPassword}
          placeholder={t('new password')}
          required
        />
      </div>
      <div>
        <button className="btn btn-primary mt-3">{t('Change password')}</button>
      </div>
    </form>
  );

  return (
    <Layout breadcrumbs={false} footer={false}>
      <div className="container">
        <h2>{t('Password reset')}</h2>
        <hr />
        {passwordResetForm()}
        {showError()}
        {showMessage()}
      </div>
    </Layout>
  );
};

export const getStaticPaths = async () => {
  return {
    paths: [], //indicates that no page needs be created at build time
    fallback: 'blocking', //indicates the type of fallback
  };
};

export default withRouter(ResetPassword);
