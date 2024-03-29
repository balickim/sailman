import Layout from '@components/layout/Layout';
import SignupComponent from '@components/auth/SignupComponent';

const Signup = () => {
  return (
    <>
      <Layout footer={false}>
        <div className="row">
          <div className="col-md-6 offset-md-3">
            <SignupComponent />
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Signup;
