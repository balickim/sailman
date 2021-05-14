import Layout from "@components/Layout";
import IsAuthorized from "@components/auth/IsAuthorized";
import AnnouncementRead from "@components/manage/AnnouncementRead";

const Announcements = () => {
  return (
    <Layout footer={false} breadcrumbs={false}>
      <IsAuthorized role={["admin", "moderator"]}>
        <div className="container">
          <div className="row">
            <div className="col-md-12">
              <AnnouncementRead />
            </div>
          </div>
        </div>
      </IsAuthorized>
    </Layout>
  );
};

export default Announcements;
