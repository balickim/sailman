import Header from "./Header";
import HeaderUser from "./HeaderUser";
import HeaderModerator from "./HeaderModerator";
import HeaderAdmin from "./HeaderAdmin";
import { useAuth } from "../components/auth/AuthProvider";
import NProgress from "nprogress";
import Router from "next/router";

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
          {children}
        </>
      );
    case "moderator":
      return (
        <>
          <HeaderModerator />
          {children}
        </>
      );
    case "admin":
      return (
        <>
          <HeaderAdmin />
          {children}
        </>
      );
    default:
      return (
        <>
          <Header />
          {children}
        </>
      );
  }
};

export default Layout;
