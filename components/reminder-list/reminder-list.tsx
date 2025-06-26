'use client';
import { ReminderResponse } from "@/dto/ReminderResponse";
import { useDeleteReminderMutation, useGetRemindersQuery } from "@/store/api/reminderApi";
import { AccessAlarm, Add, Close, DeleteOutline, Edit } from "@mui/icons-material";
import { Dialog, DialogTitle, IconButton } from "@mui/material";
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useCallback, useState } from "react";
import ReminderCreateUpdate from "../reminder-create-update/reminder-create-update";
import { useSnackbar } from "@/context/snackbar";

dayjs.extend(relativeTime);

export const ReminderList: React.FC = () => {
    const [type, setType] = useState('upcoming');
    const { data, error, isLoading, refetch } = useGetRemindersQuery(type, {
        refetchOnMountOrArgChange: true,
    });
    const { showMessage } = useSnackbar();
    const dateGroupedReminders = data?.reduce((acc: { [key: string]: ReminderResponse[] }, reminder) => {
        const date = new Date(reminder.dateTimeEpoch * 1000).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
        if (!acc[date]) {
            acc[date] = [];
        }
        acc[date].push(reminder);
        return acc;
    }, {});
    const today = new Date().toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
    const [open, setOpen] = useState(false);
    const [editReminder, setEditReminder] = useState<ReminderResponse | undefined>();
    const [deleteReminder] = useDeleteReminderMutation();
    const onDelete = useCallback(async (id: string) => {
        await deleteReminder({
            id,
        });
        refetch();
        showMessage('Reminder deleted !', 'success');
    }, [refetch, deleteReminder, showMessage])
    return (
        <div className="p-5 flex flex-col items-center">
            <Dialog maxWidth="xs" fullWidth open={open} onClose={() => setOpen(false)}>
                <DialogTitle className="text-lg font-bold!">
                    {editReminder ? 'Update': 'New'} Reminder
                </DialogTitle>
                <IconButton
                    aria-label="close"
                    onClick={() => setOpen(false)}
                    sx={(theme) => ({
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: theme.palette.grey[500],
                    })}
                >
                    <Close />
                </IconButton>
                <ReminderCreateUpdate onUpdate={() => {
                    refetch();
                    setOpen(false);
                }} reminder={editReminder} />
            </Dialog>
            <div className="flex justify-center mb-6 mt-5">
                <div className="flex gap-2">
                    <button onClick={() => setType('upcoming')} className={`flex items-center gap-1 px-4 py-2 rounded-full ${type === 'upcoming' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'} font-medium focus:outline-none focus:ring-2 focus:ring-blue-400`}>
                        Upcoming <AccessAlarm fontSize="small" />
                    </button>
                    <button onClick={() => setType('all')} className={`flex items-center gap-1 px-4 py-2 rounded-full ${type === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'} font-medium hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400`}>
                        All
                    </button>
                    <button onClick={() => {
                        setEditReminder(undefined);
                        setOpen(true)
                    }} className={`flex items-center gap-1 px-4 py-2 rounded-full ${type === 'create' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'} font-medium hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400`}>
                        New <Add fontSize="small" />
                    </button>
                </div>
            </div>
            <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl p-8">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold">{type === 'upcoming' ? 'Upcoming Reminders' : 'All Reminders'}</h2>
                </div>
                {/* Placeholder for reminder items */}
                {isLoading && <p className="text-gray-500">Loading...</p>}
                {error && <p className="text-red-500">Error fetching reminders</p>}
                {!isLoading && !error && data?.length === 0 && (
                    <p className="text-gray-500">No reminders available.</p>
                )}
                <div className=" max-h-[500px] overflow-auto">
                    {
                        dateGroupedReminders && Object.entries(dateGroupedReminders).map(([date, reminders]) => (
                            <div key={date} className={`mb-6`}>
                                <div className="flex items-center gap-2 text-md font-semibold mb-4">
                                    {date}
                                    {(date === today) && (
                                        <span className="ml-2 px-2 py-1 rounded-full bg-blue-100 text-blue-500 font-semibold text-xs">
                                            Today
                                        </span>
                                    )}
                                </div>
                                <div className="pl-4 border-l-2 border-blue-400 flex flex-wrap gap-2">
                                    {reminders.map((reminder) => (
                                        <div key={reminder._id} className={`mb-4 p-4 border border-slate-200 rounded-lg w-sm ${(reminder.dateTimeEpoch * 1000) < Date.now() ? 'opacity-60 hover:opacity-100' : ''}`}>
                                            <div className="flex items-center justify-between mb-2">
                                                <h3 className="font-semibold">{reminder.title}</h3>
                                                <div className="flex items-center gap-2">
                                                    <IconButton onClick={() => onDelete(reminder._id)} size="small">
                                                        <DeleteOutline color="error" fontSize="small" />
                                                    </IconButton>
                                                    <IconButton onClick={() => {
                                                        setEditReminder(reminder);
                                                        setOpen(true);
                                                    }} size="small">
                                                        <Edit color="primary" fontSize="small" />
                                                    </IconButton>
                                                </div>
                                            </div>
                                            <p>{reminder.description}</p>
                                            <p className="text-gray-500">
                                                {new Date(reminder.dateTimeEpoch * 1000).toLocaleTimeString('en-IN', {
                                                    timeStyle: 'short',
                                                })} ({dayjs().to(new Date(reminder.dateTimeEpoch * 1000))})
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))
                    }

                </div>
            </div>
        </div>
    );
}