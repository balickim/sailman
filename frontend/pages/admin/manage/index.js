import Layout from '@components/Layout';
import IsAuthorized from '@components/auth/IsAuthorized';
import AnnouncementList from '@components/manage/AnnouncementList';

const Announcements = () => {
  return (
    <Layout footer={false} breadcrumbs={false}>
      <IsAuthorized userRole={['admin', 'moderator']}>
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <AnnouncementList />
            </div>
          </div>
        </div>
      </IsAuthorized>
    </Layout>
  );
};

export default Announcements;
