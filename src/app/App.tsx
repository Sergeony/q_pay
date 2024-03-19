import { Suspense, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ThemeToggle } from "features/ThemeToggle";
import { LangSelect } from "features/LangSelect";
import AppRouter from "app/providers/RoutesProvider/ui/RoutesProvider";
import { AppRoutes } from "shared/const/router";
import { Header } from "widgets/Header";
import { useLazyGetUserPrefsQuery, userActions } from "entities/User";
import { useDispatch, useSelector } from "react-redux";
import { webSocketService } from "shared/api/ws";
import { jwtDecode } from "jwt-decode";
import { LOCAL_STORAGE_ACCESS_TOKEN_KEY } from "shared/const/localStorage";
import { refreshToken } from "shared/api/api";
import { BalanceBlock } from "entities/Balance";

interface DecodedToken {
    id: number;
    user_type: number;
}

// TODO: move providers from index.tsx to here
const App = () => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [getUserPrefs] = useLazyGetUserPrefsQuery();

    useEffect(() => {
        const performGetUserPrefs = async () => getUserPrefs();
        const performRefresh = async () => refreshToken();
        const accessToken = localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN_KEY);
        if (accessToken) {
            performRefresh()
                .then((response) => {
                    if (response) {
                        const decodedToken: DecodedToken = jwtDecode(response.access);
                        dispatch(userActions.setUserData({
                            type: decodedToken.user_type,
                            id: decodedToken.id,
                        }));
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
                        webSocketService.connect();
                    }
                });
        }
    }, [
        dispatch,
        getUserPrefs
    ]);

    return (
        <div id="app" className="app">
            <Suspense>
                <Header />
                <AppRouter />
            </Suspense>
        </div>
    );
};

export default App;
