import Layout from "../../../components/Layout";
import Admin from "../../../components/auth/Admin";
import AnnouncementRead from "../../../components/crud/AnnouncementRead";

const Announcements = () => {
  return (
    <Layout>
      <Admin>
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
      </Admin>
    </Layout>
  );
};

export default Announcements;
