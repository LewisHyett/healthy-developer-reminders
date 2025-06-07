import * as vscode from 'vscode';
import { Reminder, DEFAULT_REMINDERS } from './reminderTypes';

export function saveReminders(context: vscode.ExtensionContext, reminders: Reminder[]) {
    const toSave = reminders.map(({ label, interval, paused }) => ({ label, interval, paused }));
    context.globalState.update('reminders', toSave);
}

export function loadReminders(context: vscode.ExtensionContext): Reminder[] {
    const saved = context.globalState.get<Reminder[]>('reminders');
    if (saved && Array.isArray(saved) && saved.length > 0) {
        return saved.map(r => ({ ...r }));
    }
    return DEFAULT_REMINDERS.map(r => ({ ...r }));
}