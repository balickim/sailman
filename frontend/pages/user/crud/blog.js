import Layout from "../../../components/Layout";
import BlogCreate from "../../../components/crud/BlogCreate";

const Blog = () => {
  return (
    <Layout>
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-12 pt-5 pb-5">
            <h2>Manage a new blog</h2>
          </div>
          <div className="col-md-12">
            <BlogCreate />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Blog;
