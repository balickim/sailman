import useTranslation from 'next-translate/useTranslation';

import Layout from '@components/layout/Layout';
import IsAuthorized from '@components/auth/IsAuthorized';
import CreateUpdate from '@components/announcements/CreateUpdate';

const Announcement = () => {
  let { t } = useTranslation('announcements');

  return (
    <Layout footer={false}>
      <IsAuthorized userRole={['admin', 'moderator']}>
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-12 pt-5 pb-5">
              <h2>{t('edit_announcement')}</h2>
            </div>
            <div className="col-md-12">
              <CreateUpdate />
            </div>
          </div>
        </div>
      </IsAuthorized>
    </Layout>
  );
};

export default Announcement;
