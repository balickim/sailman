import Layout from '@components/layout/Layout';
import IsAuthorized from '@components/auth/IsAuthorized';
import List from '@components/announcements/List';

const Announcements = () => {
  return (
    <Layout footer={false} breadcrumbs={false}>
      <IsAuthorized userRole={['admin', 'moderator']}>
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <List />
            </div>
          </div>
        </div>
      </IsAuthorized>
    </Layout>
  );
};

export default Announcements;
