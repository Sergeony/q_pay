import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from ".";
import { RequisitesProps, setRequisites } from "../store/reducers/requisitesSlice";

export const requisitesApi = createApi({
  reducerPath: 'requisitesApi',
  baseQuery,
  tagTypes: ["Requisites"],
  endpoints: (builder) => ({
    fetchRequisites: builder.query<RequisitesProps[], void>({
      query: () => 'api/v1/trader/requisites',
      providesTags: ["Requisites"],
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(setRequisites(data));
        } catch (error) {
          // Обработка ошибок
        }
      },
    }),
    createRequisite: builder.mutation<RequisitesProps, any>({
      query: (body) => ({
        url: 'api/v1/trader/requisites/',
        method: 'POST',
        body,
      }),
      invalidatesTags: ["Requisites"],
    }),
    updateRequisite: builder.mutation<RequisitesProps, Partial<RequisitesProps> & Pick<RequisitesProps, 'id'>>({
      query: ({ id, ...body }) => ({
        url: `api/v1/trader/requisites/${id}/`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ["Requisites"],
    }),
    deleteRequisite: builder.mutation<{ success: boolean; id: number }, number>({
      query: (id) => ({
        url: `api/v1/trader/requisites/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ["Requisites"],
    }),
  }),
});

export const {
  useFetchRequisitesQuery,
  useCreateRequisiteMutation,
  useUpdateRequisiteMutation,
  useDeleteRequisiteMutation,
} = requisitesApi;
