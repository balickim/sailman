import Router from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import { useState, useEffect } from 'react';
import { MDBSpinner } from 'mdb-react-ui-kit';
import { toast } from 'react-toastify';

import { useAuth } from './AuthProvider';
import { loginSchema, preSignupSchema } from '@http/auth.validators';
import authResource from '@http/auth.resource';
import { LoginDto, preSignupDto } from '@http/auth.dtos';

const AuthForm = ({ type, fields, typeTranslation }) => {
  const { t } = useTranslation('common');

  const [values, setValues] = useState({
    username: '',
    email: '',
    password: '',
    errorPath: '',
    errors: [],
    isLoading: false,
    message: '',
    showSignupForm: true,
  });

  const { errorPath, errors, isLoading, message, showSignupForm, username, email, password } =
    values;

  const { user, authenticate } = useAuth();

  useEffect(() => {
    user && Router.push(`/`);
  }, [user]);

  const handleSubmit = e => {
    e.preventDefault();
    setValues({ ...values, isLoading: true, errors: [] });
    if (type === 'signup') {
      const user: preSignupDto = { username, email, password };
      preSignupSchema
        .validate(user)
        .then(() => {
          authResource.preSignup(user).then(response => {
            setValues({
              ...values,
              isLoading: false,
            });
            if (response) {
              toast.success(t('notification.email_sent', { count: 10 }));
              setValues({
                ...values,
                username: '',
                email: '',
                password: '',
                isLoading: false,
              });
            }
          });
        })
        .catch(function (err) {
          if (err.errors) {
            setValues({ ...values, errors: err.errors, errorPath: err.path, isLoading: false });
          }
        });
    } else if (type === 'login') {
      const user: LoginDto = { email, password };
      loginSchema
        .validate(user)
        .then(() => {
          authResource.login(user).then(response => {
            setValues({ ...values, isLoading: false });
            if (response) {
              authenticate(response.data, () => {
                Router.push('/');
              });
            }
          });
        })
        .catch(function (err) {
          if (err.errors) {
            setValues({ ...values, errors: err.errors, errorPath: err.path, isLoading: false });
          }
        });
    }
  };

  const handleChange = name => e => {
    setValues({ ...values, errors: [], [name]: e.target.value });
  };

  const showLoading = () =>
    isLoading ? (
      <div className="text-center">
        <MDBSpinner color="primary" />
      </div>
    ) : (
      ''
    );

  const showMessage = () =>
    message ? <div className="alert alert-info text-center">{message}</div> : '';

  const ErrorField = value => {
    if (errorPath === value.name) {
      return (
        <>
          {errors.map((element, i) => {
            return (
              <div key={i} className="invalid-feedback" role="alert">
                {element}
              </div>
            );
          })}
        </>
      );
    }
    return null;
  };

  const form = () => {
    return (
      <>
        <h2 className="text-center pt-4 pb-4">{t(typeTranslation)}</h2>
        <form onSubmit={handleSubmit} noValidate>
          {fields.map((element, i) => {
            return (
              <div key={i} className="form-group mb-4">
                <label htmlFor={element.toString()} className="form-label">
                  {t(element.toString())}
                </label>
                <input
                  id={element.toString()}
                  value={values[element]}
                  onChange={handleChange(element.toString())}
                  type={
                    element.toString() === 'password' || element.toString() === 'email'
                      ? element
                      : 'text'
                  }
                  className={`form-control form-control-lg ${
                    errorPath === element.toString() ? 'is-invalid' : ''
                  }`}
                  required
                />
                <ErrorField name={element.toString()} />
              </div>
            );
          })}
          <button className="btn btn-primary btn-lg btn-block" disabled={isLoading}>
            {t(typeTranslation)}
            {showLoading()}
          </button>
        </form>
        {type === 'login' ? (
          <>
            <hr />
            <h2>{t('or')}</h2>
            <hr />
            {/* <LoginGoogle buttonText={t('action.login_with_google')} /> */}
          </>
        ) : (
          <></>
        )}
      </>
    );
  };
  return <>{showSignupForm ? form() : showMessage()}</>;
};

export default AuthForm;
