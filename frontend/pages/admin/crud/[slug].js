import Layout from "../../../components/Layout";
import Admin from "../../../components/auth/Admin";
import AnnouncementUpdate from "../../../components/crud/AnnouncementUpdate";

const Announcement = () => {
  return (
    <Layout>
      <Admin>
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-12 pt-5 pb-5">
              <h2>Update announcement</h2>
            </div>
            <div className="col-md-12">
              <AnnouncementUpdate />
            </div>
          </div>
        </div>
      </Admin>
    </Layout>
  );
};

export default Announcement;
