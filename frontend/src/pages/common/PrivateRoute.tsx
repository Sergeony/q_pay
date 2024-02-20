import React from 'react';
import {Navigate} from 'react-router-dom';
import {getUserTypeFromToken} from "../../utils";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store/store";
import {setUser} from "../../store/reducers/authSlice";

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
