import Layout from "@components/Layout";
import IsAuthorized from "@components/auth/IsAuthorized";
import AnnouncementRead from "@components/crud/AnnouncementRead";

const Announcements = () => {
  return (
    <Layout footer={false}>
      <IsAuthorized role={["admin", "moderator"]}>
        <div className="container">
          <div className="row">
            <div className="col-md-12 pt-5 pb-5">
              <h2>Manage announcements</h2>
            </div>
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
