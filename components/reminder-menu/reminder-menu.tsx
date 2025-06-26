import { AccessAlarm, Add } from "@mui/icons-material";

export default function ReminderMenu() {
    return (
        <div className="flex justify-center mb-6">
            <div className="flex gap-2">
                <button className="flex items-center gap-1 px-4 py-2 rounded-full bg-blue-600 text-white font-medium focus:outline-none focus:ring-2 focus:ring-blue-400">
                    Upcoming <AccessAlarm fontSize="small" />
                </button>
                <button className="flex items-center gap-1 px-4 py-2 rounded-full bg-gray-200 text-gray-700 font-medium hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400">
                    All
                </button>
                <button className="flex items-center gap-1 px-4 py-2 rounded-full bg-gray-200 text-gray-700 font-medium hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400">
                    New <Add fontSize="small" />
                </button>
            </div>
        </div>
    );
}