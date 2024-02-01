import { createApi } from '@reduxjs/toolkit/query/react'
import {baseQuery} from ".";
import {
  advertisementsProps,
  createAdvertisementProps,
  setAdvertisements,
  toggleAdvertisementActivityProps
} from "../store/reducers/advertisementsSlice";
import {BaseQueryArg} from "@reduxjs/toolkit/dist/query/baseQueryTypes";



export const advertisementsApi = createApi({
  reducerPath: 'advertisementsApi',
  baseQuery,
  tagTypes: ["Advertisement"],
  endpoints: (builder) => ({
    fetchAdvertisements: builder.query<advertisementsProps[], void>({
      query: () => ({
        url: 'api/v1/trader/advertisements/'
      }),
      providesTags: ["Advertisement"],
      onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(setAdvertisements(data));
        } catch (error) {
          // Обработка ошибок
        }
      }
    }),
    createAdvertisement: builder.mutation<advertisementsProps, createAdvertisementProps>({
      query: (body) => ({
        url: 'api/v1/trader/advertisements/',
        method: 'POST',
        body
      }),
      invalidatesTags: ["Advertisement"]
    }),
    deleteAdvertisement: builder.mutation<string, number>({
      query: (id) => ({
        url: `api/v1/trader/advertisements/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ["Advertisement"],
    }),
    toggleAdvertisementActivity: builder.mutation<advertisementsProps, toggleAdvertisementActivityProps>({
      query: ({id, is_activated}) => ({
        url: `api/v1/trader/advertisements/${id}/`,
        method: 'PATCH',
        body: {is_activated}
      }),
      invalidatesTags: ["Advertisement"],
    }),
  }),
})

export const {
  useFetchAdvertisementsQuery,
  useCreateAdvertisementMutation,
  useDeleteAdvertisementMutation,
  useToggleAdvertisementActivityMutation,
} = advertisementsApi;
