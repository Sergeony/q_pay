import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';


export const hostUrl = 'http://localhost:8000'
const apiVersion = 'v1'
export const baseUrl = `${hostUrl}`

export const baseQuery = fetchBaseQuery({
  baseUrl: `${baseUrl}/`,
  prepareHeaders: (headers) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    //Language header (localization)
    // const language = localStorage.getItem("i18nextLng");
    // if (language) {
    //   headers.set("Accept-Language", language);
    // }

    return headers;
  },
});
