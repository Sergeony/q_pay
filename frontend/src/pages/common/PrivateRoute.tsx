import React from 'react';
import {Navigate} from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

interface PrivateRouteProps {
  component: React.ComponentType;
  roles: string[]; // Список разрешенных ролей
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({component: Component, roles, ...rest}): React.ReactElement | null => {
  const user = useSelector((state: RootState) => state.user.user);

  return (
    <>
      {user && roles.includes(user.role)
        ? <Component />
        : <Navigate to="/sign-in" />
      }
    </>
  );
};

export default PrivateRoute;
