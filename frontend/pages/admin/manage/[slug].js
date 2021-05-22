import useTranslation from 'next-translate/useTranslation';

import Layout from '@components/Layout';
import IsAuthorized from '@components/auth/IsAuthorized';
import AnnouncementForm from '@components/manage/AnnouncementForm';

const Announcement = () => {
  let { t } = useTranslation('announcements');

  return (
    <Layout footer={false}>
      <IsAuthorized userRole={['admin', 'moderator']}>
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-12 pt-5 pb-5">
              <h2>{t('Edit announcement')}</h2>
            </div>
            <div className="col-md-12">
              <AnnouncementForm />
            </div>
          </div>
        </div>
      </IsAuthorized>
    </Layout>
  );
};

export default Announcement;
