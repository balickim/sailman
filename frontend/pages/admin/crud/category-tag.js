import Layout from "../../../components/Layout";
import IsAuthorized from "../../../components/auth/IsAuthorized";
import Category from "../../../components/crud/Category";
import Tag from "../../../components/crud/Tag";

const CategoryTag = () => {
  return (
    <Layout footer={false}>
      <IsAuthorized role={["admin", "moderator"]}>
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-12 pt-5 pb-5">
              <h2>Manage categories and tags</h2>
            </div>
            <div className="col-md-6">
              <Category />
            </div>
            <div className="col-md-6">
              <Tag />
            </div>
          </div>
        </div>
      </IsAuthorized>
    </Layout>
  );
};

export default CategoryTag;
