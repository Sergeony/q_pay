import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { getUserData } from "entities/User";
import { useSelector } from "react-redux";

interface RequireAuthProps {
    children: ReactNode;
    publicOnly?: true;
}

export function PublicRoute(props: RequireAuthProps) {
    const {
        children,
        publicOnly,
    } = props;
    const location = useLocation();
    const userData = useSelector(getUserData);

    if (userData && publicOnly) {
        return (
            <Navigate
                to={{ pathname: "/pay/in/active" }}
                state={{ from: location }}
                replace
            />
        );
    }

    return children;
}
