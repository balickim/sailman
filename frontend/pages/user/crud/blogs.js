import Layout from "../../../components/Layout";
import BlogRead from "../../../components/crud/BlogRead";
import { useAuth } from "../../../actions/AuthProvider";

const Blogs = () => {
  const { user } = useAuth();
  const username = user && user.username;
  return (
    <Layout>
      <div className="container">
        <div className="row">
          <div className="col-md-12 pt-5 pb-5">
            <h2>Manage blogs</h2>
          </div>
          <div className="col-md-12">
            <BlogRead username={username} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Blogs;
