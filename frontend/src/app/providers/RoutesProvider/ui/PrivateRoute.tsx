import { ReactNode, useMemo } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getUserData, UserType } from "entities/User";
import { getRouteForbidden, getRouteLogin } from "shared/const/router";
import { useSelector } from "react-redux";

interface RequireAuthProps {
    children: ReactNode;
    roles: UserType[];
}

export function PrivateRoute(props: RequireAuthProps) {
    const {
        children,
        roles,
    } = props;
    const location = useLocation();
    const userData = useSelector(getUserData);

    const hasPermission = useMemo(() => {
        if (!userData) {
            return true;
        }
        return roles.includes(userData.type);
    }, [roles, userData]);

    if (!userData) {
        // Redirect them to the /login page, but save the current location they were
        // trying to go to when they were redirected. This allows us to send them
        // along to that page after they log in, which is a nicer user experience
        // than dropping them off on the home page.
        return (
            <Navigate
                to={{ pathname: getRouteLogin() }}
                state={{ from: location }}
                replace
            />
        );
    }

    if (!hasPermission) {
        return (
            <Navigate
                to={{ pathname: getRouteForbidden() }}
                state={{ from: location }}
                replace
            />
        );
    }

    return children;
}
