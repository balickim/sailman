import { useState, useEffect } from 'react';
import { MDBSpinner } from 'mdb-react-ui-kit';

import { useAuth } from '@components/auth/AuthProvider';

import { getProfile, update } from '@root/src/actions/user';

const ProfileUpdate = () => {
  const [values, setValues] = useState({
    username: '',
    name: '',
    email: '',
    about: '',
    password: '',
    error: false,
    success: false,
    loading: false,
    photo: '',
    userData: '',
  });

  const { updateUser } = useAuth();

  const { username, name, email, about, password, error, success, loading, photo } = values;

  const init = () => {
    getProfile().then(data => {
      if (data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({
          ...values,
          username: data.username,
          name: data.name,
          email: data.email,
          about: data.about,
        });
      }
    });
  };

  const handleChange = name => e => {
    const value = name === 'photo' ? e.target.files[0] : e.target.value;
    setValues({ ...values, [name]: value, error: false, success: false });
  };

  const handleSubmit = e => {
    e.preventDefault();
    setValues({ ...values, loading: true });

    let userData = new FormData();
    userData.append('username', username);
    userData.append('name', name);
    userData.append('email', email);
    // userData.append("password", password);
    userData.append('about', values.about);
    if (values.photo) {
      userData.append('photo', values.photo);
    }

    update(userData).then(data => {
      if (data.error) {
        setValues({
          ...values,
          error: data.error,
          success: false,
          loading: false,
        });
      } else {
        updateUser(data, () => {
          setValues({
            ...values,
            username: data.username,
            name: data.name,
            email: data.email,
            about: data.about,
            password: '',
            success: true,
            loading: false,
          });
        });
      }
    });
  };

  const profileUpdateForm = () => (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="btn btn-outline-info">
          Profile photo
          <input onChange={handleChange('photo')} type="file" accept="image/*" hidden />
        </label>
      </div>
      <div className="form-group">
        <label className="text-muted">Username</label>
        <input
          onChange={handleChange('username')}
          type="text"
          className="form-control"
          value={username}
        />
      </div>
      <div className="form-group">
        <label className="text-muted">Name</label>
        <input onChange={handleChange('name')} type="text" className="form-control" value={name} />
      </div>
      <div className="form-group">
        <label className="text-muted">About</label>
        <input
          onChange={handleChange('about')}
          type="text"
          className="form-control"
          value={about}
        />
      </div>
      <div className="form-group">
        <label className="text-muted">Email</label>
        <input
          onChange={handleChange('email')}
          type="text"
          className="form-control"
          value={email}
        />
      </div>
      <div>
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </div>
    </form>
  );

  useEffect(() => {
    init();
  }, []);

  const showError = () => (
    <div className="alert alert-danger" style={{ display: error ? '' : 'none' }}>
      {error}
    </div>
  );

  const showSuccess = () => (
    <div className="alert alert-success" style={{ display: success ? '' : 'none' }}>
      Profile updated. Please reload to see the changes.
    </div>
  );

  const showLoading = () => (
    <div style={{ display: loading ? '' : 'none' }}>
      <MDBSpinner color="primary" />
    </div>
  );

  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-md-4">
            {username && username !== '' && Boolean(username) !== false ? (
              <img
                src={`${process.env.NEXT_PUBLIC_API}/user/photo/${username}`}
                alt="user profile"
                style={{ maxHeight: 'auto', maxWidth: '100%' }}
                className="img img-fluid img-thumbnail mb-3"
              />
            ) : (
              ''
            )}
          </div>
          <div className="col-md-8 mb-5">
            {profileUpdateForm()}
            <div className="pt-3">
              {showLoading()}
              {showError()}
              {showSuccess()}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileUpdate;
