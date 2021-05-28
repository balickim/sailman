import Layout from '@components/layout/Layout';
import ProfileUpdate from '@components/auth/ProfileUpdate';

const UserProfileUpdate = () => {
  return (
    <Layout>
      <div className="container-fluid">
        <div className="row">
          <ProfileUpdate />
        </div>
      </div>
    </Layout>
  );
};

export default UserProfileUpdate;
