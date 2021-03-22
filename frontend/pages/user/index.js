import Link from "next/link";

import Layout from "../../components/Layout";

const UserIndex = () => {
  return (
    <Layout>
      <div className="container-fluid">
        <div className="row">
          <div className="col-md-12 pt-5 pb-5">
            <h2>User Dashboard</h2>
          </div>
          <div className="col-md-4">
            <ul className="list-group">
              <li className="list-group-item">
                <Link href="/user/crud/blog">
                  <a>Create blog</a>
                </Link>
              </li>
            </ul>
            <ul className="list-group">
              <li className="list-group-item">
                <Link href="/user/crud/blogs">
                  <a>Update/delete blogs</a>
                </Link>
              </li>
            </ul>
            <ul className="list-group">
              <li className="list-group-item">
                <Link href="/user/update">
                  <a>Update profile</a>
                </Link>
              </li>
            </ul>
          </div>
          <div className="col-md-8">right</div>
        </div>
      </div>
    </Layout>
  );
};

export default UserIndex;
