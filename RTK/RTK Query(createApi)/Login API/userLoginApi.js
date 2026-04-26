import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const token = localStorage.getItem('token')
export const userLoginApi = createApi({
  reducerPath: 'userLoginApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: 'http://localhost:5000/',
    // This function runs dynamically on every request!
    prepareHeaders: (headers, { getState }) => {
      // 1. Try to get token from Redux state (Best practice)
      // const token = (getState()).auth.token; 
      
      // 2. Or get it from localStorage if that's where you store it
      const token = localStorage.getItem('token');

      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),

  tagTypes: ['Balance','Transactions'],

  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: 'login',
        method: 'POST',
        body: credentials,
        invalidatesTags: ['Balance','Transactions'],
      }),
    }),
    getAccountBalance: builder.query({
      query: () => ({
        url: 'account/balance',
        headers: {
          Authorization: `Bearer ${token}`
        }
      }),
      providesTags: ['Balance'],
    }),
    addDeposit: builder.mutation({
      query: (amount) => ({
        url: `account/deposit`,
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: { amount }
      }),
      invalidatesTags: ['Balance','Transactions'],
    }),
    transactions: builder.query({
      query : () => ({
        url : `account/transactions`,
        headers : {
          Authorization : `Bearer ${token}`
        }
      }),
      providesTags: ['Transactions']
    })
  }),
});

// Export the auto-generated hook
export const { useLoginMutation, useGetAccountBalanceQuery, useAddDepositMutation, useTransactionsQuery } = userLoginApi;
