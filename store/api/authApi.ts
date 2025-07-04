import { AuthResponse } from '@/dto/AuthResponse';
import { AuthReqSchema } from '@/schema/AuthReqSchema';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL,
  }),
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, AuthReqSchema>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),
    signup: builder.mutation<AuthResponse, AuthReqSchema>({
      query: (newUser) => ({
        url: '/auth/register',
        method: 'POST',
        body: newUser,
      }),
    }),
  }),
});

export const { useLoginMutation, useSignupMutation } = authApi;
