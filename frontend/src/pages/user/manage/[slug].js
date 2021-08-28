import useTranslation from 'next-translate/useTranslation';

import Layout from '@components/layout/Layout';
import CreateUpdate from '@components/announcements/CreateUpdate';

const Announcement = () => {
  let { t } = useTranslation('announcements');

  return (
    <Layout footer={false}>
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-12 pt-5 pb-5">
            <h2>{t('Edit announcement')}</h2>
          </div>
          <div className="col-md-12">
            <CreateUpdate />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Announcement;
