import { ReactNode, useMemo } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getUserData, UserType } from "entities/User";
import { AppRoutes } from "shared/const/router";
import { useSelector } from "react-redux";

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
    const userData = useSelector(getUserData);

    const isRequiredType = useMemo(() => {
        if (!userData) {
            return true;
        }
        return requiredUserType === userData.type;
    }, [requiredUserType, userData]);

    // if (!userType) {
    //     // Redirect them to the /login page, but save the current location they were
    //     // trying to go to when they were redirected. This allows us to send them
    //     // along to that page after they log in, which is a nicer user experience
    //     // than dropping them off on the home page.
    //     return <Navigate to={AppRoutes.forbidden} state={{ from: location }} replace />;
    // }

    if (!isRequiredType) {
        return <Navigate to={AppRoutes.FORBIDDEN} state={{ from: location }} replace />;
    }

    return children;
}
