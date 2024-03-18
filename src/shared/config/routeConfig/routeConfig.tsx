import { RouteProps } from "react-router-dom";

import { UserType } from "entities/User";

// @ts-ignore
// const SignUpForm = lazy(() => import("features/auth/ui/SignUpForm.tsx"));
// @ts-ignore
// const SignInForm = lazy(() => import("features/auth/ui/SignInForm.tsx"));

export type AppRoutesProps = RouteProps & {
    authOnly?: boolean;
    userType?: UserType;
}
