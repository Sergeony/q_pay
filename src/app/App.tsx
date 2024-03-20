import { Suspense, useEffect } from "react";
import AppRouter from "app/providers/RoutesProvider/ui/RoutesProvider";
import { Header } from "widgets/Header";
import { getUserData, useLazyGetUserPrefsQuery, userActions } from "entities/User";
import { useDispatch, useSelector } from "react-redux";
import { webSocketService } from "shared/api/ws";
import { jwtDecode } from "jwt-decode";
import { LOCAL_STORAGE_ACCESS_TOKEN_KEY } from "shared/const/localStorage";
import { refreshToken } from "shared/api/api";

interface DecodedToken {
    id: number;
    user_type: number;
}

// TODO: move providers from index.tsx to here
const App = () => {
    const dispatch = useDispatch();
    const [getUserPrefs] = useLazyGetUserPrefsQuery();
    const useData = useSelector(getUserData);

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
                    }
                });
        }
    }, [
        dispatch,
        getUserPrefs
    ]);

    useEffect(() => {
        if (useData) {
            webSocketService.connect();
        } else {
            webSocketService.disconnect();
        }
    }, [useData]);

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
