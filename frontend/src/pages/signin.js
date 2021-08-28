import Layout from '@components/layout/Layout';
import SigninComponent from '@components/auth/SigninComponent';

const Signin = () => {
  return (
    <>
      <Layout footer={false}>
        <div className="row">
          <div className="col-md-6 offset-md-3">
            <SigninComponent />
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Signin;
