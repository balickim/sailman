import Layout from '@components/layout/Layout';
import AuthForm from '@components/auth/AuthForm';

const Signin = () => {
  return (
    <>
      <Layout footer={false}>
        <div className="row">
          <div className="col-md-6 offset-md-3">
            <AuthForm fields={['email', 'password']} type="login" typeTranslation="action.login" />
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Signin;
