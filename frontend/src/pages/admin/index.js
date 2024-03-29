import Layout from '@components/layout/Layout';
import IsAuthorized from '@components/auth/IsAuthorized';
import Link from 'next/link';

const AdminIndex = () => {
  return (
    <Layout footer={false}>
      <IsAuthorized userRole={['admin', 'moderator']}>
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-12 pt-5 pb-5">
              <h2>Admin Dashboard</h2>
            </div>
            <div className="col-md-4">
              <ul className="list-group">
                <li className="list-group-item">
                  <Link href="/admin/manage/tag">
                    <a>Tag dashboard</a>
                  </Link>
                </li>
              </ul>
              <ul className="list-group">
                <li className="list-group-item">
                  <Link href="/admin/manage">
                    <a>Update/Delete announcements</a>
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
      </IsAuthorized>
    </Layout>
  );
};

export default AdminIndex;
