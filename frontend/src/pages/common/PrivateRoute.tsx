import React from 'react';
import {Navigate} from 'react-router-dom';
import {getUserTypeFromToken} from "../../utils";

interface PrivateRouteProps {
  Component: React.ComponentType;
  useTypes: number[];
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({Component, useTypes})=> {
    const userType = getUserTypeFromToken();

    if (!userType || !useTypes.includes(userType)) {
      return <Navigate to="/sign-in/" replace />;
    }

    return <Component />;
  };

export default PrivateRoute;
