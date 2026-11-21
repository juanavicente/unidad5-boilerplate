import { Navigate } from 'react-router-dom';
import useAuth from '../hook/useAuth';

function ProtectedRoute({ children, redirectTo = '/login', allowedRole }) {
  const { isAuthenticated, role } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  if (allowedRole && role !== allowedRole) {
    const roleRedirect = role === 'Administrador' ? '/admin' : '/';

    return <Navigate to={roleRedirect} replace />;
  }

  return children;
}

export default ProtectedRoute;
