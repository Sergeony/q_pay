import { api } from "shared/api/api";

interface GetUserPrefsResponse {
    data: {
        language: string;
        timezone: string;
        isLightTheme: string;
        isActive: boolean;
    }
}

const userApi = api.injectEndpoints({
    endpoints: (builder) => ({
        getUserPrefs: builder.query<GetUserPrefsResponse, void>({
            query: () => ({
                url: "api/web/user/prefs/",
            }),
        }),
    }),
});

export const {
    useLazyGetUserPrefsQuery,
} = userApi;
