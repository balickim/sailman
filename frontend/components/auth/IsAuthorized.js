import { useAuth } from "@components/auth/AuthProvider";

const IsAuthorized = ({ children, role }) => {
  const { user } = useAuth();

  const appRolesList = ["user", "moderator", "admin"];

  if (role && appRolesList.some((v) => role.includes(v))) {
    if (role.includes(user?.role)) {
      return <>{children}</>;
    }
  }
  return <p>Not authorized</p>;
};

export default IsAuthorized;
