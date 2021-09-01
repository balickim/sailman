import { useAuth } from '@components/auth/AuthProvider';
import Error from 'next/error';

const IsAuthorized = ({ children, userRole }) => {
  const { user } = useAuth();

  const appRolesList = ['user', 'moderator', 'admin'];

  if (userRole && appRolesList.some(v => userRole.includes(v))) {
    if (userRole.includes(user?.role)) {
      return <>{children}</>;
    }
  }
  return <Error statusCode={401} title="Not authorized" />;
};

export default IsAuthorized;
