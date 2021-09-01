import { useAuth } from '@components/auth/AuthProvider';

import Header from '@components/layout/Header';
import Footer from '@components/layout/Footer';
import FeedbackForm from '@components/forms/FeedbackForm';
import Breadcrumbs from '@components/layout/Breadcrumbs';

import NProgress from 'nprogress';
import Router from 'next/router';

Router.onRouteChangeStart = () => NProgress.start();
Router.onRouteChangeComplete = () => NProgress.done();
Router.onRouteChangeError = () => NProgress.done();

const Layout = ({ children, wrap, footer, breadcrumbs }) => {
  wrap = wrap ?? true;
  footer = footer ?? true;
  breadcrumbs = breadcrumbs ?? true;

  const { user } = useAuth();

  return (
    <>
      <Header userRole={user?.role} />
      {user?.role === 'user' && <FeedbackForm />}
      {wrap && (
        <div
          style={{ minHeight: '70vh' }}
          className="container bg-white mt-2 mb-2 pt-2 pb-2 border rounded">
          {breadcrumbs && <Breadcrumbs />}
          {children}
        </div>
      )}

      {!wrap && children}

      {footer && <Footer />}
    </>
  );
};

export default Layout;
