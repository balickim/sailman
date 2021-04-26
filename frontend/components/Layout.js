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
          <div className="container">{children}</div>
        </>
      );
    case "moderator":
      return (
        <>
          <HeaderModerator />
          <div className="container">{children}</div>
        </>
      );
    case "admin":
      return (
        <>
          <HeaderAdmin />
          <div className="container">{children}</div>
        </>
      );
    default:
      return (
        <>
          <Header />
          <div className="container">{children}</div>
        </>
      );
  }
};

export default Layout;
