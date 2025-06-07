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
exports.HealthyDeveloperProvider = exports.ReminderItem = void 0;
const vscode = __importStar(require("vscode"));
class ReminderItem extends vscode.TreeItem {
    reminder;
    constructor(reminder) {
        super(reminder.label, vscode.TreeItemCollapsibleState.None);
        this.reminder = reminder;
        this.description = reminder.paused ? 'Paused' : `Every ${reminder.interval} min`;
        this.contextValue = reminder.paused ? 'pausedReminder' : 'activeReminder';
        this.iconPath = new vscode.ThemeIcon(reminder.paused ? 'debug-pause' : 'clock');
    }
}
exports.ReminderItem = ReminderItem;
class HealthyDeveloperProvider {
    reminders;
    _onDidChangeTreeData = new vscode.EventEmitter();
    onDidChangeTreeData = this._onDidChangeTreeData.event;
    constructor(reminders) {
        this.reminders = reminders;
    }
    getTreeItem(element) {
        return element;
    }
    getChildren() {
        return this.reminders().map(reminder => new ReminderItem(reminder));
    }
    refresh() {
        this._onDidChangeTreeData.fire();
    }
}
exports.HealthyDeveloperProvider = HealthyDeveloperProvider;
//# sourceMappingURL=reminderProvider.js.map