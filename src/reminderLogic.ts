import * as vscode from 'vscode';
import { Reminder } from './reminderTypes';

export function startReminder(reminder: Reminder, showMessage = false) {
    if (reminder.timer) {
        clearInterval(reminder.timer);
    }
    if (!reminder.paused) {
        reminder.timer = setInterval(() => {
            vscode.window.showInformationMessage(`⏰ ${reminder.label}`);
        }, reminder.interval * 60 * 1000);
        if (showMessage) {
            vscode.window.showInformationMessage(`Started reminder: ${reminder.label}`);
        }
    }
}

export function stopReminder(reminder: Reminder) {
    if (reminder.timer) {
        clearInterval(reminder.timer);
        reminder.timer = undefined;
    }
}