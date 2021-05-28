import Router from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import { useState, useEffect } from 'react';
import { MDBSpinner } from 'mdb-react-ui-kit';

import { preSignup } from '@actions/auth';
import { useAuth } from '@components/auth/AuthProvider';

const SignupComponent = () => {
  let { t } = useTranslation('common');

  const [values, setValues] = useState({
    name: '',
    email: '',
    password: '',
    error: '',
    loading: false,
    message: '',
    showForm: true,
  });

  const { name, email, password, error, loading, message, showForm } = values;

  const { user } = useAuth();

  useEffect(() => {
    user && Router.push(`/`);
  }, [user]);

  const handleSubmit = e => {
    e.preventDefault();
    setValues({ ...values, loading: true, error: false });
    const user = { name, email, password };

    preSignup(user).then(data => {
      if (data.error) {
        setValues({ ...values, error: data.error, loading: false });
      } else {
        setValues({
          ...values,
          name: '',
          email: '',
          password: '',
          loading: false,
          message: t('email_sent'),
          showForm: false,
        });
      }
    });
  };

  const handleChange = name => e => {
    setValues({ ...values, error: false, [name]: e.target.value });
  };

  const showLoading = () =>
    loading ? (
      <div className="text-center">
        <MDBSpinner color="primary" />
      </div>
    ) : (
      ''
    );
  const showError = () =>
    error ? <div className="alert alert-danger text-center">{error}</div> : '';
  const showMessage = () =>
    message ? <div className="alert alert-info text-center">{message}</div> : '';

  const signupForm = () => {
    return (
      <>
        <h2 className="text-center pt-4 pb-4">{t('Signup')}</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group mb-2">
            <input
              value={name}
              onChange={handleChange('name')}
              type="text"
              className="form-control"
              placeholder={t('Name')}></input>
          </div>
          <div className="form-group mb-2">
            <input
              value={email}
              onChange={handleChange('email')}
              type="email"
              className="form-control"
              placeholder={t('E-mail')}></input>
          </div>
          <div className="form-group">
            <input
              value={password}
              onChange={handleChange('password')}
              type="password"
              className="form-control"
              placeholder={t('Password')}></input>
          </div>
          <div className="pt-2">
            <button className="btn btn-primary">{t('Signup')}</button>
          </div>
        </form>
      </>
    );
  };
  return (
    <>
      {showError()}
      {showMessage()}
      {showForm && signupForm()}
      {showLoading()}
    </>
  );
};

export default SignupComponent;
