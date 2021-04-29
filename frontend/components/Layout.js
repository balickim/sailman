import { useAuth } from "../components/auth/AuthProvider";

import Header from "./header/Header";
import HeaderUser from "./header/HeaderUser";
import HeaderModerator from "./header/HeaderModerator";
import HeaderAdmin from "./header/HeaderAdmin";

import Footer from "./Footer";

import FeedbackForm from "./form/FeedbackForm";

import NProgress from "nprogress";
import Router from "next/router";

Router.onRouteChangeStart = (url) => NProgress.start();
Router.onRouteChangeComplete = (url) => NProgress.done();
Router.onRouteChangeError = (url) => NProgress.done();

const Layout = ({ children, wrap, footer }) => {
  wrap = wrap ?? true;
  footer = footer ?? true;

  const { user } = useAuth();

  switch (user?.role) {
    case "user":
      return (
        <>
          <HeaderUser />
          <FeedbackForm />
          {wrap && (
            <div className="container bg-white mt-2 mb-2 pt-2 pb-2 border rounded">
              {children}
            </div>
          )}

          {!wrap && children}

          {footer && <Footer />}
        </>
      );
    case "moderator":
      return (
        <>
          <HeaderModerator />
          {wrap && (
            <div className="container bg-white mt-2 mb-2 pt-2 pb-2 border rounded">
              {children}
            </div>
          )}

          {!wrap && children}

          {footer && <Footer />}
        </>
      );
    case "admin":
      return (
        <>
          <HeaderAdmin />
          {wrap && (
            <div className="container bg-white mt-2 mb-2 pt-2 pb-2 border rounded">
              {children}
            </div>
          )}

          {!wrap && children}

          {footer && <Footer />}
        </>
      );
    default:
      return (
        <>
          <Header />
          {wrap && (
            <div className="container bg-white mt-2 mb-2 pt-2 pb-2 border rounded">
              {children}
            </div>
          )}

          {!wrap && children}

          {footer && <Footer />}
        </>
      );
  }
};

export default Layout;
