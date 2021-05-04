import Layout from "@components/Layout";
import IsAuthorized from "@components/auth/IsAuthorized";
import AnnouncementForm from "@components/crud/AnnouncementForm";

const Announcement = () => {
  return (
    <Layout footer={false} breadcrumbs={false}>
      <IsAuthorized role={["admin", "moderator"]}>
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-12 pt-5 pb-5">
              <h2>Update announcement</h2>
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
