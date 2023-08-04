import { Navigate, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from './UserContext';

export default function RequireLogin({ children }) {
  const { user } = useContext(UserContext);
  const location = useLocation();
 
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
}

  return children;
}
