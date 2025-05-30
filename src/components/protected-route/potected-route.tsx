import { ReactElement, useEffect } from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { Preloader } from '../../components/ui';
import {
  getUser,
  getUserisInit,
  getUserLoading
} from '../../services/selectors';
import { useSelector, useDispatch } from '../../services/store';

type ProtectedRouteProps = {
  children?: ReactElement;
  onlyUnAuth?: boolean;
  redirectTo?: string;
};

export const ProtectedRoute = ({
  children,
  onlyUnAuth = false,
  redirectTo
}: ProtectedRouteProps) => {
  const user = useSelector(getUser);
  const isInit = useSelector(getUserisInit);
  const isLoading = useSelector(getUserLoading);
  const location = useLocation();

  if (!isInit || isLoading) {
    return <Preloader />;
  }

  if (onlyUnAuth && user) {
    const redirectPath = redirectTo || location.state?.from?.pathname || '/';
    return <Navigate to={redirectPath} replace state={{ from: location }} />;
  }

  if (!onlyUnAuth && !user) {
    return <Navigate to='/login' replace state={{ from: location }} />;
  }

  return children ?? <Outlet />;
};
