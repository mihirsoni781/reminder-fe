import * as yup from "yup";

export const reminderReqSchema = yup.object({
    title: yup.string().required("Title is required"),
    description: yup.string().optional(),
    dateTimeEpoch: yup.number().required("Date and time are required").typeError("Invalid date format"),
});
export type ReminderReqSchema = yup.InferType<typeof reminderReqSchema>;
