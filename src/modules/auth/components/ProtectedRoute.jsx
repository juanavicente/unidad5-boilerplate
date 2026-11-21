import { Navigate } from 'react-router-dom';
import useAuth from '../hook/useAuth';

function ProtectedRoute({ children, redirectTo = '/login', allowedRole }) {
  const { isAuthenticated, role } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  const normalizedRole = role?.toUpperCase();
  const normalizedAllowedRole = allowedRole?.toUpperCase();

  if (allowedRole && normalizedRole !== normalizedAllowedRole) {
    const roleRedirect = normalizedRole === 'ADMINISTRADOR' ? '/admin' : '/';

    return <Navigate to={roleRedirect} replace />;
  }

  return children;
}

export default ProtectedRoute;
