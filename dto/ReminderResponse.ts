export type ReminderResponse = {
    _id: string;
    title: string;
    description: string;
    dateTimeEpoch: number;
}

export type ReminderListResponse = {
    reminders: ReminderResponse[];
}