import { RouteProps } from "react-router-dom";

import { UserType } from "entities/User";
import { ReactNode } from "react";

// @ts-ignore
// const SignUpForm = lazy(() => import("features/auth/ui/SignUpForm.tsx"));
// @ts-ignore
// const SignInForm = lazy(() => import("features/auth/ui/SignInForm.tsx"));

export type AppRoutesProps = RouteProps & {
    path: string;
    publicOnly?: true;
    roles?: UserType[];
    childRoutes?: ReactNode[];
}
