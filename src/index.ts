#!/usr/bin/env node
import { Command } from 'commander';
import { startTimer, stopTimer } from './timer';
import { getRandomExercise } from './exercise';
import { sendExerciseNotification } from './notifier';
import { launchUI } from './server';
import fs from 'fs';
import os from 'os';

const program = new Command();

program
  .name('eye-app')
  .description('A CLI to help you take screen breaks and do eye exercises')
  .version('1.0.0');

import { getConfig, setConfig } from './config';

program
  .command('start')
  .description('Start the eye exercise timer')
  .option('-i, --interval <minutes>', 'Interval between exercises in minutes')
  .action((options) => {
    const config = getConfig();
    let intervalMinutes: number;

    if (options.interval) {
      intervalMinutes = parseFloat(options.interval);
      if (isNaN(intervalMinutes) || intervalMinutes <= 0) {
        console.error('Error: Interval must be a positive number.');
        process.exit(1);
      }
      // Save new preference
      setConfig({ interval: intervalMinutes });
    } else {
      intervalMinutes = config.interval;
    }

    console.log('\x1b[36m%s\x1b[0m', '👀 Eye App - Break Timer Started');
    console.log('\x1B[2m' + 'Note: These exercises are for relaxation. They are not medical advice.' + '\x1B[0m\n');
    console.log(`Interval: ${intervalMinutes} minutes (saved preference)`);
    console.log('Press Ctrl+C to stop.');

    startTimer(intervalMinutes, () => {
      const exercise = getRandomExercise();
      console.log(`[${new Date().toLocaleTimeString()}] Time for a break! Exercise: ${exercise.title}`);
      sendExerciseNotification(exercise, () => {
        console.log('Notification clicked! Launching UI...');
        launchUI();
      });
    });
  });

import { spawn } from 'child_process';
import path from 'path';

program
  .command('daemon')
  .description('Run the eye exercise timer in the background')
  .option('-i, --interval <minutes>', 'Interval between exercises in minutes')
  .action((options) => {
    const config = getConfig();
    if (config.pid) {
      try {
        process.kill(config.pid, 0);
        console.log(`Timer is already running in background (PID: ${config.pid}).`);
        console.log('Run "eye-app stop" to kill it first.');
        return;
      } catch (e) {
        // Process doesn't exist, we can continue
      }
    }

    const interval = options.interval || config.interval;
    
    // Spawn a detached process
    const out = fs.openSync(path.join(os.homedir(), '.eye-app.log'), 'a');
    const child = spawn(process.argv[0], [process.argv[1], 'start', '-i', interval.toString()], {
      detached: true,
      stdio: ['ignore', out, out],
    });

    child.unref();
    setConfig({ pid: child.pid });

    console.log('\x1b[32m%s\x1b[0m', '👀 Eye App - Background Timer Started');
    console.log(`Interval: ${interval} minutes`);
    console.log(`PID: ${child.pid}`);
    console.log(`Logs: ~/.eye-app.log`);
    process.exit(0);
  });

program
  .command('stop')
  .description('Stop the background eye exercise timer')
  .action(() => {
    const config = getConfig();
    if (!config.pid) {
      console.log('No background timer is running.');
      return;
    }

    try {
      process.kill(config.pid, 'SIGINT'); // Send SIGINT so it can clean up if needed
      console.log(`Stopped background timer (PID: ${config.pid}).`);
      setConfig({ pid: undefined });
    } catch (e) {
      console.log(`Could not find process with PID ${config.pid}. Clearing config.`);
      setConfig({ pid: undefined });
    }
  });

program
  .command('ui')
  .description('Launch the visual eye exercise in your browser')
  .action(() => {
    console.log('\x1b[36m%s\x1b[0m', '👀 Eye App - Launching Visual Exercises');
    console.log('\x1B[2m' + 'Note: These exercises are for relaxation. They are not medical advice.' + '\x1B[0m\n');
    launchUI();
  });

program.parse();
