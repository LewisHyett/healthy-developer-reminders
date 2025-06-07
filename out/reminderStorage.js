"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveReminders = saveReminders;
exports.loadReminders = loadReminders;
const reminderTypes_1 = require("./reminderTypes");
function saveReminders(context, reminders) {
    const toSave = reminders.map(({ label, interval, paused }) => ({ label, interval, paused }));
    context.globalState.update('reminders', toSave);
}
function loadReminders(context) {
    const saved = context.globalState.get('reminders');
    if (saved && Array.isArray(saved) && saved.length > 0) {
        return saved.map(r => ({ ...r }));
    }
    return reminderTypes_1.DEFAULT_REMINDERS.map(r => ({ ...r }));
}
//# sourceMappingURL=reminderStorage.js.map