import { createApi } from '@reduxjs/toolkit/query/react'
import {baseQueryWithReauth} from "./index";
import {
  AdProps,
  CreateAdProps,
  setAds,
  ToggleAdActivityProps
} from "_store/reducers/adsSlice";


interface FetchAdsRequestProps {
  user_id?: number;
}


export const adsApi = createApi({
  reducerPath: 'adsApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ["Ads"],
  endpoints: (builder) => ({
    fetchAds: builder.query<AdProps[], FetchAdsRequestProps>({
      query: (params) => ({
        url: 'api/web/trader/ads/',
        params,
      }),
      providesTags: ["Ads"],
      onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(setAds(data));
        } catch (error) {
          // Обработка ошибок
        }
      }
    }),
    createAd: builder.mutation<AdProps, CreateAdProps>({
      query: (body) => ({
        url: 'api/web/trader/ads/',
        method: 'POST',
        body
      }),
      invalidatesTags: ["Ads"]
    }),
    deleteAd: builder.mutation<string, number>({
      query: (id) => ({
        url: `api/web/trader/ads/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ["Ads"],
    }),
    toggleAdActivity: builder.mutation<AdProps, ToggleAdActivityProps>({
      query: ({id, is_active}) => ({
        url: `api/web/trader/ads/${id}/`,
        method: 'PATCH',
        body: {is_active}
      }),
      invalidatesTags: ["Ads"],
    }),
  }),
})

export const {
  useFetchAdsQuery,
  useCreateAdMutation,
  useDeleteAdMutation,
  useToggleAdActivityMutation,
} = adsApi;
