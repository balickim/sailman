import Router from 'next/router';
import useTranslation from 'next-translate/useTranslation';
import { useState, useEffect } from 'react';
import { MDBSpinner } from 'mdb-react-ui-kit';
import { useAuth } from './AuthProvider';
import { loginSchema, preSignupSchema } from '@http/auth.validators';
import authResource from '@http/auth.resource';

const AuthForm = ({ type, fields }) => {
  let { t } = useTranslation('common');

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
      const user = { username, email, password };
      preSignupSchema
        .validate(user)
        .then(() => {
          authResource.preSignup(user).then(data => {
            if (data.errors) {
              setValues({
                ...values,
                errors: data.errors,
                errorPath: data.path,
                isLoading: false,
              });
            } else {
              setValues({
                ...values,
                username: '',
                email: '',
                password: '',
                isLoading: false,
                message: t('notification.email_sent'),
                showSignupForm: false,
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
      const user = { email, password };
      loginSchema.validate(user).then(() => {
        authResource.login(user).then(data => {
          if (data.error) {
            setValues({ ...values, error: data.error, loading: false });
          } else {
            authenticate(data, () => {
              Router.push('/');
            });
          }
        });
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
      return errors.map((element, i) => {
        return (
          <div key={i} className="invalid-feedback" role="alert">
            {element}
          </div>
        );
      });
    }
    return null;
  };

  const form = () => {
    return (
      <>
        <h2 className="text-center pt-4 pb-4">{t(type)}</h2>
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
                  type={element.toString() === 'password' ? 'password' : 'text'}
                  className={`form-control form-control-lg ${
                    errorPath === element.toString() ? 'is-invalid' : ''
                  }`}
                  required
                />
                <ErrorField name={element.toString()} />
              </div>
            );
          })}
          <button className="btn btn-primary btn-lg btn-block">
            {t(type)}
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
