import { Suspense, useEffect } from "react";
import AppRouter from "app/providers/RoutesProvider/ui/RoutesProvider";
import { Header } from "widgets/Header";
import { getUserData, useLazyGetUserPrefsQuery, userActions } from "entities/User";
import { useDispatch, useSelector } from "react-redux";
import { webSocketService } from "shared/api/ws";
import { jwtDecode } from "jwt-decode";
import { LOCAL_STORAGE_ACCESS_TOKEN_KEY } from "shared/const/localStorage";

interface DecodedToken {
    user_id: number;
    user_type: number;
}

// TODO: move providers from index.tsx to here
const App = () => {
    const dispatch = useDispatch();
    const [getUserPrefs] = useLazyGetUserPrefsQuery();
    const useData = useSelector(getUserData);

    useEffect(() => {
        const accessToken = localStorage.getItem(LOCAL_STORAGE_ACCESS_TOKEN_KEY);
        if (accessToken) {
            getUserPrefs()
                .then(({
                    data: userPrefs,
                    isSuccess,
                }) => {
                    if (isSuccess) {
                        const decodedToken: DecodedToken = jwtDecode(accessToken);
                        dispatch(userActions.setUserData({
                            type: decodedToken.user_type,
                            id: decodedToken.user_id,
                        }));
                        dispatch(userActions.setUserPrefs({
                            isActive: userPrefs.isActive,
                            lang: userPrefs.language,
                            tz: userPrefs.timezone,
                            theme: userPrefs.isLightTheme ? "light" : "dark",
                        }));
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
