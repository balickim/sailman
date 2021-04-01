import { useEffect } from "react";
import Router from "next/router";
import { useAuth } from "../../components/auth/AuthProvider";

const Admin = ({ children }) => {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      Router.push(`/signin`);
    } else if (user.role !== "admin") {
      Router.push(`/`);
    }
  }, []);
  return <>{children}</>;
};

export default Admin;
