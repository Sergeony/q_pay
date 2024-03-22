import React, { memo, Suspense, useCallback } from "react";
import { Route, Routes } from "react-router-dom";
import { AppRoutesProps } from "shared/config/routeConfig/routeConfig";
import { Loader } from "shared/ui/Loader/Loader";
import { RequireAuth } from "./requireAuth";
import { routeConfig } from "../config/config";

const AppRouter = memo(() => {
    const renderWithWrapper = useCallback((route: AppRoutesProps) => {
        const element = (
            <Suspense fallback={<Loader />}>
                {route.element}
            </Suspense>
        );
        return (
            <Route
                key={route.path}
                path={route.path}
                element={route.authOnly
                    ? (
                        <RequireAuth>
                            {element}
                        </RequireAuth>
                    )
                    : element}
            />
        );
    }, []);

    return (
        <Routes>
            {Object.values(routeConfig).map(renderWithWrapper)}
        </Routes>
    );
});

export default AppRouter;
