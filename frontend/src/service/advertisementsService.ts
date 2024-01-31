import { createApi } from '@reduxjs/toolkit/query/react'
import {baseQuery} from ".";
import {advertisementsProps, createAdvertisementsProps, setAdvertisements} from "../store/reducers/advertisementsSlice";
import {BaseQueryArg} from "@reduxjs/toolkit/dist/query/baseQueryTypes";



export const advertisementsApi = createApi({
  reducerPath: 'advertisementsApi',
  baseQuery,
  endpoints: (builder) => ({
    fetchAdvertisements: builder.query<advertisementsProps[], void>({
      query: () => ({
        url: 'api/v1/trader/advertisements/'
      }),
      onQueryStarted: async (arg, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(setAdvertisements( data ));
        } catch (error) {
          // Обработка ошибок
        }
      }
    }),
    createAdvertisement: builder.mutation<advertisementsProps, createAdvertisementsProps>({
      query: (body) => ({
        url: 'api/v1/trader/advertisements/',
        method: 'POST',
        body
      }),
    }),
    deleteAdvertisement: builder.mutation<string, number>({
      query: (id) => ({
        url: `api/v1/trader/advertisements/${id}/`,
        method: 'DELETE',
      }),
    }),
  }),
})

export const {
  useFetchAdvertisementsQuery,
  useCreateAdvertisementMutation,
  useDeleteAdvertisementMutation,
} = advertisementsApi;
