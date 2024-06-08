import React, {
    memo, Suspense, useCallback
} from "react";
import {
    Route, Routes
} from "react-router-dom";
import { AppRoutesProps } from "shared/config/routeConfig/routeConfig";
import { Loader } from "shared/ui/Loader/Loader";
import { routeConfig } from "../config/config";
import { PrivateRoute } from "./PrivateRoute";
import { PublicRoute } from "./PublicRoute";

const AppRouter = memo(() => {
    const renderWithWrapper = useCallback((route: AppRoutesProps) => {
        const element = (
            <Suspense fallback={<Loader />}>
                {route.element}
            </Suspense>
        );
        // console.log("ROUTE PATH: ", route.path);
        return (
            <Route
                key={route.path}
                path={route.path}
                element={
                    route.roles ? (
                        <PrivateRoute roles={route.roles}>
                            {element}
                        </PrivateRoute>
                    ) : (
                        <PublicRoute publicOnly={route.publicOnly}>
                            {element}
                        </PublicRoute>
                    )
                }
            >
                {route.childRoutes}
            </Route>
        );
    }, []);

    return (
        <Routes>
            {Object.values(routeConfig).map(renderWithWrapper)}
        </Routes>
    );
});

export default AppRouter;
