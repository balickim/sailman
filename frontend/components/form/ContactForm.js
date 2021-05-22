import { useState } from 'react';
import useTranslation from 'next-translate/useTranslation';

import { send } from '@actions/form';

const ContactForm = () => {
  let { t } = useTranslation('common');

  const [values, setValues] = useState({
    message: '',
    name: '',
    email: '',
    sent: false,
    buttonText: t('Submit'),
    success: false,
    error: false,
  });

  const { message, name, email, sent, buttonText, success, error } = values;

  const clickSubmit = e => {
    e.preventDefault();
    setValues({ ...values, buttonText: '...' });
    send({ name, email, message }).then(data => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({
          ...values,
          sent: true,
          name: '',
          email: '',
          message: '',
          buttonText: t('Sent'),
          success: data.success,
        });
      }
    });
  };

  const handleChange = name => e => {
    setValues({
      ...values,
      [name]: e.target.value,
      error: false,
      success: false,
      buttonText: t('Submit'),
    });
  };

  const showSuccessMessage = () =>
    success && <div className="alert alert-info">{t('Thank you for contacting us.')}</div>;

  const showErrorMessage = () => (
    <div className="alert alert-danger" style={{ display: error ? '' : 'none' }}>
      {error}
    </div>
  );

  const contactForm = () => {
    return (
      <form onSubmit={clickSubmit} className="pb-5">
        <div className="form-group">
          <label className="lead">{t('Message')}</label>
          <textarea
            onChange={handleChange('message')}
            type="text"
            className="form-control"
            value={message}
            required
            rows="10"></textarea>
        </div>

        <div className="form-group">
          <label className="lead">{t('Name')}</label>
          <input
            type="text"
            onChange={handleChange('name')}
            className="form-control"
            value={name}
            required
          />
        </div>

        <div className="form-group">
          <label className="lead">{t('E-mail')}</label>
          <input
            type="email"
            onChange={handleChange('email')}
            className="form-control"
            value={email}
            required
          />
        </div>

        <div className="pt-3">
          <button className="btn btn-primary">{buttonText}</button>
        </div>
      </form>
    );
  };

  return (
    <>
      <h2>{t('Contact form')}</h2>
      <hr />
      {showSuccessMessage()}
      {showErrorMessage()}
      {contactForm()}
    </>
  );
};

export default ContactForm;
