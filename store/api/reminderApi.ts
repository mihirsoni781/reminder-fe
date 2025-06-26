import { ReminderResponse } from "@/dto/ReminderResponse";
import { ReminderReqSchema } from "@/schema/ReminderReqSchema";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import Cookies from "js-cookie";

export const reminderApi = createApi({
    reducerPath: 'reminderApi',
    baseQuery: fetchBaseQuery({
        baseUrl: 'http://localhost:8000/api',
        prepareHeaders: (headers) => {
            // Example: get token from localStorage
            const token = Cookies.get('accessToken');
            if (!token) {
                return headers;
            }
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    endpoints: (builder) => ({
        getReminders: builder.query<ReminderResponse[], string>({
            query: (type) => ({
                url: `/reminders?type=${type}`,
                method: 'GET',
            }),
        }),
        createReminder: builder.mutation({
            query: (reminder) => ({
                url: '/reminders',
                method: 'POST',
                body: reminder,
            }),
        }),
        updateReminder: builder.mutation({
            query: ({ id, reminder }: { id: string, reminder: ReminderReqSchema }) => ({
                url: `/reminders/${id}`,
                method: 'PUT',
                body: reminder,
            }),
        }),
        deleteReminder: builder.mutation({
            query: ({ id }: { id: string }) => ({
                url: `/reminders/${id}`,
                method: 'DELETE',
            }),
        }),
    }),
});

export const { useGetRemindersQuery, useCreateReminderMutation, useUpdateReminderMutation, useDeleteReminderMutation } = reminderApi;
