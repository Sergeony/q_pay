import { UserSchema } from "entities/User";
import { SignInFormSchema } from "features/auth";

export interface StateSchema {
    user: UserSchema,
    sigInForm?: SignInFormSchema,
}
