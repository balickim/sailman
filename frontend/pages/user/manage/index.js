import Layout from "@components/Layout";
import AnnouncementRead from "@components/manage/AnnouncementRead";
import { useAuth } from "@components/auth/AuthProvider";

const Announcements = () => {
  const { user } = useAuth();
  const username = user && user.username;
  return (
    <Layout footer={false}>
      <div className="container">
        <div className="row">
          <div className="col-md-12">
            <AnnouncementRead username={username} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Announcements;
