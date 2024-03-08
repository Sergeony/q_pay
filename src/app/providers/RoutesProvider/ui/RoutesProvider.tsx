import React, { memo, Suspense, useCallback } from "react";
import { Route, Routes } from "react-router-dom";
import { AppRoutesProps, routeConfig } from "shared/config/routeConfig/routeConfig";
import { Loader, LoaderRole } from "shared/ui/Loader/Loader";
import { RequireAuth } from "./RequireAuth";

const AppRouter = memo(() => {
    const renderWithWrapper = useCallback((route: AppRoutesProps) => {
        const element = (
            <Suspense fallback={<Loader role={LoaderRole.PAGE} />}>
                {route.element}
            </Suspense>
        );
        return (
            <Route
                key={route.path}
                path={route.path}
                element={route.authOnly ? <RequireAuth>{element}</RequireAuth> : element}
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
