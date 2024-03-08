// import { useSelector } from "react-redux";
// // import { getUserAuthData } from "entities/User";
// import { Navigate, useLocation } from "react-router-dom";
// import { RoutePath } from "shared/config/routeConfig/routeConfig";
// import { ReactNode } from "react";
//
// interface RequireAuthProps {
//     children: ReactNode;
// }
//
// export function RequireAuth(props: RequireAuthProps) {
//     const {
//         children
//     } = props;
//     // const auth = useSelector(getUserAuthData);
//     const auth = true;
//     const location = useLocation();
//
//     if (!auth) {
//         // Redirect them to the /login page, but save the current location they were
//         // trying to go to when they were redirected. This allows us to send them
//         // along to that page after they log in, which is a nicer user experience
//         // than dropping them off on the home page.
//         return <Navigate to={RoutePath.sign_in} state={{ from: location }} replace />;
//     }
//
//     return children;
// }
