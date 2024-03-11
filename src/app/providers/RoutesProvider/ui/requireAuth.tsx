import { ReactNode, useMemo } from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import { getUserAuthData, UserType, getUserType } from "entities/User";
import { RoutePath } from "shared/config/routeConfig/routeConfig";

interface RequireAuthProps {
    children: ReactNode;
    requiredUserType?: UserType;
}

export function RequireAuth(props: RequireAuthProps) {
    const {
        children,
        requiredUserType,
    } = props;
    const location = useLocation();
    const userType = useSelector(getUserType);
    const auth = useSelector(getUserAuthData);

    const isRequiredType = useMemo(() => {
        if (!userType) {
            return true;
        }
        return requiredUserType === userType;
    }, [requiredUserType, userType]);

    if (!auth) {
        // Redirect them to the /login page, but save the current location they were
        // trying to go to when they were redirected. This allows us to send them
        // along to that page after they log in, which is a nicer user experience
        // than dropping them off on the home page.
        return <Navigate to={RoutePath.forbidden} state={{ from: location }} replace />;
    }

    if (!isRequiredType) {
        return <Navigate to={RoutePath.forbidden} state={{ from: location }} replace />;
    }

    return children;
}
