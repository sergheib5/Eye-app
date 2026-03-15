"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendExerciseNotification = sendExerciseNotification;
const node_notifier_1 = __importDefault(require("node-notifier"));
const exercise_1 = require("./exercise");
function sendExerciseNotification(exercise) {
    node_notifier_1.default.notify({
        title: 'Time for an Eye Break! 👀',
        subtitle: exercise.title,
        message: exercise.description,
        sound: true, // Play a sound when the notification appears
        wait: false, // Do not wait for user action
    });
}
//# sourceMappingURL=notifier.js.map