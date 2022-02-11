import AuthForm from '@components/auth/AuthForm';
import Layout from '@components/layout/Layout';

const Signup = () => {
  return (
    <>
      <Layout footer={false}>
        <div className="row">
          <div className="col-md-6 offset-md-3">
            <AuthForm
              fields={['username', 'email', 'password']}
              type="signup"
              typeTranslation="action.signup"
            />
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Signup;
