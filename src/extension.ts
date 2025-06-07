// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { Reminder, DEFAULT_REMINDERS } from './reminderTypes';
import { HealthyDeveloperProvider, ReminderItem } from './reminderProvider';
import { saveReminders, loadReminders } from './reminderStorage';
import { startReminder, stopReminder } from './reminderLogic';

let reminders: Reminder[] = [];
let provider: HealthyDeveloperProvider;

export function activate(context: vscode.ExtensionContext) {
    reminders = loadReminders(context);

    provider = new HealthyDeveloperProvider(() => reminders);
    vscode.window.registerTreeDataProvider('healthyDeveloperView', provider);

    reminders.forEach(reminder => startReminder(reminder));

    context.subscriptions.push(
        vscode.commands.registerCommand('healthy-developer.pauseReminder', (item: ReminderItem) => {
            const reminder = item.reminder;
            reminder.paused = true;
            stopReminder(reminder);
            saveReminders(context, reminders);
            provider.refresh();
        }),
        vscode.commands.registerCommand('healthy-developer.resumeReminder', (item: ReminderItem) => {
            const reminder = item.reminder;
            reminder.paused = false;
            startReminder(reminder, true);
            saveReminders(context, reminders);
            provider.refresh();
        }),
        vscode.commands.registerCommand('healthy-developer.addReminder', async () => {
            const label = await vscode.window.showInputBox({ prompt: 'Reminder label' });
            if (!label) { return; }
            const intervalStr = await vscode.window.showInputBox({ prompt: 'Interval in minutes', validateInput: v => isNaN(Number(v)) || Number(v) <= 0 ? 'Enter a positive number' : undefined });
            if (!intervalStr) { return; }
            const interval = Number(intervalStr);
            const newReminder: Reminder = { label, interval, paused: false };
            reminders.push(newReminder);
            startReminder(newReminder, true);
            saveReminders(context, reminders);
            provider.refresh();
        }),
        vscode.commands.registerCommand('healthy-developer.editReminderInterval', async (item: ReminderItem) => {
            const reminder = item.reminder;
            const intervalStr = await vscode.window.showInputBox({
                prompt: `Set new interval (minutes) for "${reminder.label}"`,
                value: reminder.interval.toString(),
                validateInput: v => isNaN(Number(v)) || Number(v) <= 0 ? 'Enter a positive number' : undefined
            });
            if (!intervalStr) { return; }
            reminder.interval = Number(intervalStr);
            if (!reminder.paused) {
                stopReminder(reminder);
                startReminder(reminder, true);
            }
            saveReminders(context, reminders);
            provider.refresh();
        }),
        vscode.commands.registerCommand('healthy-developer.deleteReminder', async (item: ReminderItem) => {
            const reminder = item.reminder;
            const confirm = await vscode.window.showWarningMessage(
                `Delete reminder "${reminder.label}"?`,
                { modal: true },
                'Delete'
            );
            if (confirm === 'Delete') {
                stopReminder(reminder);
                reminders = reminders.filter(r => r !== reminder);
                saveReminders(context, reminders);
                provider.refresh();
            }
        }),
        vscode.commands.registerCommand('healthy-developer.restoreDefaults', async () => {
            const confirm = await vscode.window.showWarningMessage(
                'Restore default reminders? This will remove all your custom reminders.',
                { modal: true },
                'Restore'
            );
            if (confirm === 'Restore') {
                reminders.forEach(stopReminder);
                reminders = DEFAULT_REMINDERS.map(r => ({ ...r }));
                reminders.forEach(reminder => startReminder(reminder));
                saveReminders(context, reminders);
                provider.refresh();
                vscode.window.showInformationMessage('Default reminders restored.');
            }
        })
    );
}

export function deactivate() {
    reminders.forEach(stopReminder);
}
