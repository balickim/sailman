import { useAuth } from "@components/auth/AuthProvider";
import Error from "next/error";

const IsAuthorized = ({ children, role }) => {
  const { user } = useAuth();

  const appRolesList = ["user", "moderator", "admin"];

  if (role && appRolesList.some((v) => role.includes(v))) {
    if (role.includes(user?.role)) {
      return <>{children}</>;
    }
  }
  return <Error statusCode={401} title="Not authorized" />;
};

export default IsAuthorized;
