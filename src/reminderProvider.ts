import * as vscode from 'vscode';
import { Reminder } from './reminderTypes';

export class ReminderItem extends vscode.TreeItem {
    constructor(public readonly reminder: Reminder) {
        super(reminder.label, vscode.TreeItemCollapsibleState.None);
        this.description = reminder.paused ? 'Paused' : `Every ${reminder.interval} min`;
        this.contextValue = reminder.paused ? 'pausedReminder' : 'activeReminder';
        this.iconPath = new vscode.ThemeIcon(reminder.paused ? 'debug-pause' : 'clock');
    }
}

export class HealthyDeveloperProvider implements vscode.TreeDataProvider<ReminderItem> {
    private _onDidChangeTreeData: vscode.EventEmitter<ReminderItem | undefined | void> = new vscode.EventEmitter<ReminderItem | undefined | void>();
    readonly onDidChangeTreeData: vscode.Event<ReminderItem | undefined | void> = this._onDidChangeTreeData.event;

    constructor(private reminders: () => Reminder[]) {}

    getTreeItem(element: ReminderItem): vscode.TreeItem {
        return element;
    }

    getChildren(): ReminderItem[] {
        return this.reminders().map(reminder => new ReminderItem(reminder));
    }

    refresh(): void {
        this._onDidChangeTreeData.fire();
    }
}