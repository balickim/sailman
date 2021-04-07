import Header from "./Header";
import HeaderUser from "./HeaderUser";
import HeaderModerator from "./HeaderModerator";
import HeaderAdmin from "./HeaderAdmin";
import { useAuth } from "../components/auth/AuthProvider";
import NProgress from "nprogress";
import Router from "next/router";
import Search from "./announcement/Search";
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
          <Search />
          {children}
        </>
      );
    case "moderator":
      return (
        <>
          <HeaderModerator />
          <Search />
          {children}
        </>
      );
    case "admin":
      return (
        <>
          <HeaderAdmin />
          <Search />
          {children}
        </>
      );
    default:
      return (
        <>
          <Header />
          <Search />
          {children}
        </>
      );
  }
};

export default Layout;
