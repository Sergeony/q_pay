import { Suspense, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ThemeToggle } from "features/ThemeToggle";
import { LangSelect } from "features/LangSelect";
import AppRouter from "app/providers/RoutesProvider/ui/RoutesProvider";
import { AppRoutes } from "shared/const/router";
import { Header } from "widgets/Header";
import { getUserData, useLazyGetUserPrefsQuery, userActions } from "entities/User";
import { useDispatch, useSelector } from "react-redux";

// TODO: move providers from index.tsx to here
const App = () => {
    const { t } = useTranslation();
    const isAuthenticated = useSelector(getUserData);
    const dispatch = useDispatch();
    const [getUserPrefs] = useLazyGetUserPrefsQuery();

    useEffect(() => {
        const performGetUserPrefs = async () => getUserPrefs();

        if (isAuthenticated) {
            performGetUserPrefs()
                .then(({
                    data: userPrefs,
                    isSuccess,
                }) => {
                    if (isSuccess) {
                        dispatch(userActions.setUserPrefs({
                            isActive: userPrefs.data.isActive,
                            lang: userPrefs.data.language,
                            tz: userPrefs.data.timezone,
                            theme: userPrefs.data.isLightTheme ? "light" : "dark",
                        }));
                    }
                });
            // TODO: initiate WS connection
        }
    }, [
        isAuthenticated,
        dispatch,
        getUserPrefs
    ]);

    return (
        <div id="app" className="app">
            <Suspense>
                <div style={{ display: "flex", gap: "20px" }}>
                    <Link to={AppRoutes.REGISTER}>{t("Sign Up")}</Link>
                    <Link to={AppRoutes.LOGIN}>{t("Sign In")}</Link>
                    <Link to="/main/">{t("Main Page")}</Link>
                    <LangSelect />
                    <ThemeToggle />
                </div>
                {/* <Header /> */}
                <AppRouter />
            </Suspense>
        </div>
    );
};

export default App;
