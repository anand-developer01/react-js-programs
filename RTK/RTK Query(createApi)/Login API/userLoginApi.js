import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const userLoginApi = createApi({
  reducerPath: 'userLoginApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:5000/' }),
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: 'login',
        method: 'POST',
        body: credentials,
      }),
    }),
  }),
});

// Export the auto-generated hook
export const { useLoginMutation } = userLoginApi;
