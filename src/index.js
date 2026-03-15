#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const timer_1 = require("./timer");
const exercise_1 = require("./exercise");
const notifier_1 = require("./notifier");
const program = new commander_1.Command();
program
    .name('eye-app')
    .description('A CLI to help you take screen breaks and do eye exercises')
    .version('1.0.0');
program
    .command('start')
    .description('Start the eye exercise timer')
    .option('-i, --interval <minutes>', 'Interval between exercises in minutes', '20')
    .action((options) => {
    const intervalMinutes = parseFloat(options.interval);
    if (isNaN(intervalMinutes) || intervalMinutes <= 0) {
        console.error('Error: Interval must be a positive number.');
        process.exit(1);
    }
    console.log(`Starting eye exercise timer. You will be notified every ${intervalMinutes} minutes.`);
    console.log('Press Ctrl+C to stop.');
    (0, timer_1.startTimer)(intervalMinutes, () => {
        const exercise = (0, exercise_1.getRandomExercise)();
        console.log(`[${new Date().toLocaleTimeString()}] Time for a break! Exercise: ${exercise.title}`);
        (0, notifier_1.sendExerciseNotification)(exercise);
    });
});
program.parse();
//# sourceMappingURL=index.js.map