import { createApi } from '@reduxjs/toolkit/query/react'
import {baseQuery} from ".";
import {advertisementsProps, setAdvertisements} from "../store/reducers/advertisementsSlice";



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
  }),
})

export const {
  useFetchAdvertisementsQuery,
} = advertisementsApi;
