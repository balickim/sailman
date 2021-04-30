import Layout from "../../../components/Layout";
import AnnouncementRead from "../../../components/crud/AnnouncementRead";
import { useAuth } from "../../../components/auth/AuthProvider";

const Announcements = () => {
  const { user } = useAuth();
  const username = user && user.username;
  return (
    <Layout footer={false}>
      <div className="container">
        <div className="row">
          <div className="col-md-12 pt-5 pb-5">
            <h2>Manage announcements</h2>
          </div>
          <div className="col-md-12">
            <AnnouncementRead username={username} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Announcements;
