import Layout from '@components/Layout';
import IsAuthorized from '@components/auth/IsAuthorized';
import Tag from '@components/manage/Tag';

const TagDashboard = () => {
  return (
    <Layout footer={false}>
      <IsAuthorized userRole={['admin', 'moderator']}>
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-12 pt-5 pb-5">
              <h2>Manage categories and tags</h2>
            </div>
            <Tag />
          </div>
        </div>
      </IsAuthorized>
    </Layout>
  );
};

export default TagDashboard;
