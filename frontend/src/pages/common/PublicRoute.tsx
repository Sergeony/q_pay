import React from 'react';
import { Navigate } from 'react-router-dom';
import {getUserTypeFromToken} from "../../utils";


interface PublicRouteProps {
  Component: React.ComponentType;
}


const PublicRoute: React.FC<PublicRouteProps> = ({ Component }) => {
  const userType = getUserTypeFromToken();

  if (!userType)
    return <Component />;

  switch (userType) {
    case 1:
      return <Navigate to="/advertisements/" replace />;
    case 2:
      return <Navigate to="/deposit/" replace />;
    case 3:
      return <Navigate to="/traders/" replace />;
    default:
      return <Navigate to="/" replace />;
  }
};


export default PublicRoute;
