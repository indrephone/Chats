import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  element: React.ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element }) => {
  const isAuthenticated = localStorage.getItem('user'); // Or your auth logic

  return isAuthenticated ? element : <Navigate to="/login" />;
};

export default ProtectedRoute;

