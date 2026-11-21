import { Navigate } from 'react-router-dom';
import useAuth from '../hook/useAuth';

function ProtectedRoute({
  children,
  redirectTo = '/login',
  allowedRoles = [],
}) {
  const { isAuthenticated, role } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  const normalizedRole = role?.toUpperCase();
  const normalizedAllowedRoles = allowedRoles.map((allowedRole) =>
    allowedRole.toUpperCase()
  );

  if (
    normalizedAllowedRoles.length > 0 &&
    !normalizedAllowedRoles.includes(normalizedRole)
  ) {
    const roleRedirect = normalizedRole === 'ADMINISTRADOR' ? '/admin' : '/';

    return <Navigate to={roleRedirect} replace />;
  }

  return children;
}

export default ProtectedRoute;
