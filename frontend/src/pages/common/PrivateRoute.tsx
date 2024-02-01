import React from 'react';
import {Navigate} from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

interface PrivateRouteProps {
  component: React.ComponentType;
  roles: number[]; // Список разрешенных ролей
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({component: Component, roles, ...rest}): React.ReactElement | null => {
  const user = useSelector((state: RootState) => state.auth.auth);

  return (
    <>
      {/*TODO: implement check user type and refresh token if it's expired */}
      {localStorage.getItem('accessToken')
        ? <Component />
        : <Navigate to="/sign-in" />
      }
    </>
  );
};

export default PrivateRoute;
