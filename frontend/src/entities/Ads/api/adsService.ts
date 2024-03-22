import { api } from "shared/api/api";
import { AdSchema } from "../model/types/AdSchema";

interface FetchAdsRequestProps {
    traderId?: number;
}

export interface CreateAdRequest {
    bank: number;
    attachIds: number[];
}

export interface DeleteAdRequest {
    id: number;
}

export interface PatchAdRequest {
    id: number;
    isActive?: boolean;
    attachIds?: number[];
    detachIds?: number[];
}

const adsApi = api.injectEndpoints({
    endpoints: (builder) => ({
        fetchAds: builder.query<AdSchema[], FetchAdsRequestProps>({
            query: ({ traderId }) => ({
                url: "api/web/trader/ads/",
                params: {
                    user_id: traderId,
                },
            }),
            providesTags: ["Ads"],
        }),
        createAd: builder.mutation<AdSchema, CreateAdRequest>({
            query: (body) => ({
                url: "api/web/trader/ads/",
                method: "POST",
                body
            }),
            invalidatesTags: ["Ads", "BankDetails"]
        }),
        deleteAd: builder.mutation<string, DeleteAdRequest>({
            query: ({ id }) => ({
                url: `api/web/trader/ads/${id}/`,
                method: "DELETE",
            }),
            invalidatesTags: ["Ads"],
        }),
        patchAd: builder.mutation<AdSchema, PatchAdRequest>({
            query: ({ id, ...body }) => ({
                url: `api/web/trader/ads/${id}/`,
                method: "PATCH",
                body,
            }),
            invalidatesTags: ["Ads", "BankDetails"],
        }),
    }),
    overrideExisting: false,
});

export const {
    useFetchAdsQuery,
    useCreateAdMutation,
    useDeleteAdMutation,
    usePatchAdMutation,
} = adsApi;
