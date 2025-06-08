export type Reminder = {
    label: string;
    interval: number; // in minutes
    timer?: NodeJS.Timeout;
    paused: boolean;
};

export const DEFAULT_REMINDERS: Reminder[] = [
    { label: 'Drink Water', interval: 60, paused: false },
    { label: 'Stretch your legs', interval: 60, paused: false },
    { label: 'Look away from your screen', interval: 20, paused: false }
];