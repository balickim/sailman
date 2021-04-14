import useTranslation from "next-translate/useTranslation";
import Layout from "../../../components/Layout";
import AnnouncementCreate from "../../../components/crud/AnnouncementCreate";

const Announcement = () => {
  let { t } = useTranslation("announcements");

  return (
    <Layout>
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-12 pt-5 pb-5">
            <h2>{t("Add a new announcement")}</h2>
          </div>
          <div className="col-md-12">
            <AnnouncementCreate />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Announcement;
