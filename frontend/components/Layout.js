import { useAuth } from "@components/auth/AuthProvider";

import Header from "./Header";
import Footer from "./Footer";
import FeedbackForm from "./form/FeedbackForm";
import Breadcrumbs from "@components/Breadcrumbs";

import NProgress from "nprogress";
import Router from "next/router";

Router.onRouteChangeStart = (url) => NProgress.start();
Router.onRouteChangeComplete = (url) => NProgress.done();
Router.onRouteChangeError = (url) => NProgress.done();

const Layout = ({ children, wrap, footer, breadcrumbs }) => {
  wrap = wrap ?? true;
  footer = footer ?? true;
  breadcrumbs = breadcrumbs ?? true;

  const { user } = useAuth();

  return (
    <>
      <Header role={user?.role} />
      <FeedbackForm />
      {wrap && (
        <div className="container bg-white mt-2 mb-2 pt-2 pb-2 border rounded">
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
