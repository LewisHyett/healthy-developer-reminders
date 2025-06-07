"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = __importStar(require("vscode"));
const reminderTypes_1 = require("./reminderTypes");
const reminderProvider_1 = require("./reminderProvider");
const reminderStorage_1 = require("./reminderStorage");
const reminderLogic_1 = require("./reminderLogic");
let reminders = [];
let provider;
function activate(context) {
    reminders = (0, reminderStorage_1.loadReminders)(context);
    provider = new reminderProvider_1.HealthyDeveloperProvider(() => reminders);
    vscode.window.registerTreeDataProvider('healthyDeveloperView', provider);
    reminders.forEach(reminder => (0, reminderLogic_1.startReminder)(reminder));
    context.subscriptions.push(vscode.commands.registerCommand('healthy-developer.pauseReminder', (item) => {
        const reminder = item.reminder;
        reminder.paused = true;
        (0, reminderLogic_1.stopReminder)(reminder);
        (0, reminderStorage_1.saveReminders)(context, reminders);
        provider.refresh();
    }), vscode.commands.registerCommand('healthy-developer.resumeReminder', (item) => {
        const reminder = item.reminder;
        reminder.paused = false;
        (0, reminderLogic_1.startReminder)(reminder, true);
        (0, reminderStorage_1.saveReminders)(context, reminders);
        provider.refresh();
    }), vscode.commands.registerCommand('healthy-developer.addReminder', async () => {
        const label = await vscode.window.showInputBox({ prompt: 'Reminder label' });
        if (!label) {
            return;
        }
        const intervalStr = await vscode.window.showInputBox({ prompt: 'Interval in minutes', validateInput: v => isNaN(Number(v)) || Number(v) <= 0 ? 'Enter a positive number' : undefined });
        if (!intervalStr) {
            return;
        }
        const interval = Number(intervalStr);
        const newReminder = { label, interval, paused: false };
        reminders.push(newReminder);
        (0, reminderLogic_1.startReminder)(newReminder, true);
        (0, reminderStorage_1.saveReminders)(context, reminders);
        provider.refresh();
    }), vscode.commands.registerCommand('healthy-developer.editReminderInterval', async (item) => {
        const reminder = item.reminder;
        const intervalStr = await vscode.window.showInputBox({
            prompt: `Set new interval (minutes) for "${reminder.label}"`,
            value: reminder.interval.toString(),
            validateInput: v => isNaN(Number(v)) || Number(v) <= 0 ? 'Enter a positive number' : undefined
        });
        if (!intervalStr) {
            return;
        }
        reminder.interval = Number(intervalStr);
        if (!reminder.paused) {
            (0, reminderLogic_1.stopReminder)(reminder);
            (0, reminderLogic_1.startReminder)(reminder, true);
        }
        (0, reminderStorage_1.saveReminders)(context, reminders);
        provider.refresh();
    }), vscode.commands.registerCommand('healthy-developer.deleteReminder', async (item) => {
        const reminder = item.reminder;
        const confirm = await vscode.window.showWarningMessage(`Delete reminder "${reminder.label}"?`, { modal: true }, 'Delete');
        if (confirm === 'Delete') {
            (0, reminderLogic_1.stopReminder)(reminder);
            reminders = reminders.filter(r => r !== reminder);
            (0, reminderStorage_1.saveReminders)(context, reminders);
            provider.refresh();
        }
    }), vscode.commands.registerCommand('healthy-developer.restoreDefaults', async () => {
        const confirm = await vscode.window.showWarningMessage('Restore default reminders? This will remove all your custom reminders.', { modal: true }, 'Restore');
        if (confirm === 'Restore') {
            reminders.forEach(reminderLogic_1.stopReminder);
            reminders = reminderTypes_1.DEFAULT_REMINDERS.map(r => ({ ...r }));
            reminders.forEach(reminder => (0, reminderLogic_1.startReminder)(reminder));
            (0, reminderStorage_1.saveReminders)(context, reminders);
            provider.refresh();
            vscode.window.showInformationMessage('Default reminders restored.');
        }
    }));
}
function deactivate() {
    reminders.forEach(reminderLogic_1.stopReminder);
}
//# sourceMappingURL=extension.js.map