import fs from 'fs';
import path from 'path';
import os from 'os';

export interface AppConfig {
  interval: number;
  speed: number;
  pid?: number;
}

const CONFIG_FILE = path.join(os.homedir(), '.eye-app-config.json');

const DEFAULT_CONFIG: AppConfig = {
  interval: 20,
  speed: 1,
};

export function getConfig(): AppConfig {
  try {
    if (fs.existsSync(CONFIG_FILE)) {
      const data = fs.readFileSync(CONFIG_FILE, 'utf-8');
      return { ...DEFAULT_CONFIG, ...JSON.parse(data) };
    }
  } catch (err) {
    console.error('Error reading config file:', err);
  }
  return DEFAULT_CONFIG;
}

export function setConfig(newConfig: Partial<AppConfig>): void {
  try {
    const currentConfig = getConfig();
    const updatedConfig = { ...currentConfig, ...newConfig };
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(updatedConfig, null, 2));
  } catch (err) {
    console.error('Error writing config file:', err);
  }
}
