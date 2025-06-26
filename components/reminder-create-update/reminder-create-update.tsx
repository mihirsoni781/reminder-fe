'use client';
import { useSnackbar } from "@/context/snackbar";
import { ReminderResponse } from "@/dto/ReminderResponse";
import { ReminderReqSchema, reminderReqSchema } from "@/schema/ReminderReqSchema";
import { useCreateReminderMutation, useUpdateReminderMutation } from "@/store/api/reminderApi";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, TextField } from "@mui/material";
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from "dayjs";
import { useCallback, useEffect } from "react";
import { Controller, useForm, useFormState } from "react-hook-form";

export default function ReminderCreateUpdate({ reminder, onUpdate }: { reminder?: ReminderResponse, onUpdate: () => void }) {
    const { register, handleSubmit, control, reset, setValue } = useForm({
        resolver: yupResolver(reminderReqSchema),
    });
    useEffect(() => {
        if (reminder) {
            reset({
                title: reminder.title,
                dateTimeEpoch: reminder.dateTimeEpoch,
                description: reminder.description,
            })
        }
    }, [reminder, reset])
    const { showMessage } = useSnackbar();
    const [createReminder] = useCreateReminderMutation();
    const [updateReminder] = useUpdateReminderMutation();
    const { errors } = useFormState({ control });
    const onSubmit = useCallback((data: ReminderReqSchema) => {
        if (reminder?._id) {
            updateReminder({
                id: reminder._id,
                reminder: data,
            }).unwrap()
                .then(() => {
                    showMessage("Reminder updated successfully", "success");
                    onUpdate();
                })
                .catch((error) => {
                    console.error("Failed to update reminder:", error);
                    showMessage("Failed to update reminder", "error");
                });
        } else {
            createReminder(data).unwrap()
                .then(() => {
                    showMessage("Reminder created successfully", "success");
                    onUpdate();
                })
                .catch((error) => {
                    console.error("Failed to create reminder:", error);
                    showMessage("Failed to create reminder", "error");
                });
        }
    }, [createReminder, showMessage, reminder, updateReminder, onUpdate])
    return (
        <div className="flex flex-col items-center p-4">
            <div className="bg-white rounded-lg w-full">
                <form className="grid grid-cols-1 gap-4" onSubmit={handleSubmit(onSubmit)}>
                    <div>
                        <TextField
                            error={!!errors.title}
                            helperText={errors.title?.message}
                            fullWidth
                            placeholder="Enter title"
                            label="Title"
                            variant="outlined"
                            {...register("title")}
                        />
                    </div>
                    <div>
                        <TextField
                            error={!!errors.description}
                            helperText={errors.description?.message}
                            fullWidth
                            placeholder="Enter description"
                            label="Description"
                            variant="outlined"
                            multiline
                            rows={4}
                            {...register("description")}
                        />
                    </div>
                    <div>
                        <Controller
                            control={control}
                            name="dateTimeEpoch"
                            render={({ field: { value } }) => (
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DateTimePicker value={value ? dayjs(new Date(value * 1000)) : null} onChange={(newValue) => {
                                        if (newValue?.unix()) {
                                            setValue('dateTimeEpoch', newValue.unix())
                                        }
                                    }} className="w-full" label="Remind At" />
                                </LocalizationProvider>
                            )}
                        />
                    </div>
                    <Button type="submit" variant="contained" color="primary" fullWidth>
                        {
                            reminder?._id ? 'Update Reminder' : 'Create Reminder'
                        }
                    </Button>
                </form>
            </div>
        </div>
    );
}