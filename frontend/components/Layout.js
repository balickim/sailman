import { useAuth } from "../components/auth/AuthProvider";

import Header from "./header/Header";
import HeaderUser from "./header/HeaderUser";
import HeaderModerator from "./header/HeaderModerator";
import HeaderAdmin from "./header/HeaderAdmin";

import NProgress from "nprogress";
import Router from "next/router";
import FeedbackForm from "./form/FeedbackForm";

Router.onRouteChangeStart = (url) => NProgress.start();
Router.onRouteChangeComplete = (url) => NProgress.done();
Router.onRouteChangeError = (url) => NProgress.done();

const Layout = ({ children }) => {
  const { user } = useAuth();

  switch (user?.role) {
    case "user":
      return (
        <>
          <HeaderUser />
          <FeedbackForm />
          {children && (
            <div className="container bg-white mt-2 mb-2 pt-2 pb-2 border rounded">
              {children}
            </div>
          )}
        </>
      );
    case "moderator":
      return (
        <>
          <HeaderModerator />
          {children && (
            <div className="container bg-white mt-2 mb-2 pt-2 pb-2 border rounded">
              {children}
            </div>
          )}
        </>
      );
    case "admin":
      return (
        <>
          <HeaderAdmin />
          {children && (
            <div className="container bg-white mt-2 mb-2 pt-2 pb-2 border rounded">
              {children}
            </div>
          )}
        </>
      );
    default:
      return (
        <>
          <Header />
          {children && (
            <div className="container bg-white mt-2 mb-2 pt-2 pb-2 border rounded">
              {children}
            </div>
          )}
        </>
      );
  }
};

export default Layout;
