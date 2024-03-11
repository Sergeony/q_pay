import { Suspense, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ThemeToggle } from "widgets/ThemeToggle";
import { LangSelect } from "widgets/LangSelect";
import { useDispatch, useSelector } from "react-redux";
import { getUserAuthData, userActions } from "entities/User";
import { LOCAL_STORAGE_ACCESS_TOKEN_KEY } from "shared/const/localStorage";
import { jwtDecode } from "jwt-decode";
import { DecodedTokenProps } from "features/auth/model/types/authSchema";
import { RoutePath } from "shared/config/routeConfig/routeConfig";
import AppRouter from "app/providers/RoutesProvider/ui/RoutesProvider";

// TODO: move providers from index.tsx to here
const App = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [initialized, setInitialized] = useState<boolean>(false);

    useEffect(() => {
        const accessToken = localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN_KEY);
        if (accessToken) {
            const decodedToken: DecodedTokenProps = jwtDecode(accessToken);
            dispatch(userActions.setUser({
                type: decodedToken.userType,
                id: decodedToken.id,
            }));
        }
        setInitialized(true);
    }, [dispatch]);

    return (
        <div id="app" className="app">
            <Suspense>
                <div style={{ display: "flex", gap: "20px" }}>
                    <Link to={RoutePath.sign_up}>{t("Sign Up")}</Link>
                    <Link to={RoutePath.sign_in}>{t("Sign In")}</Link>
                    <Link to="/main/">{t("Main Page")}</Link>
                    <LangSelect />
                    <ThemeToggle />
                </div>
                {initialized && <AppRouter />}
            </Suspense>
        </div>
    );
};

export default App;
