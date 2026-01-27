import fs from 'fs';
import path from 'path';

/**
 * Ensures a JSON file exists
 */
export function ensureJSONFile(filePath: string, defaultValue: any = []) {
  const dir = path.dirname(filePath);

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify(defaultValue, null, 2));
  }
}

/**
 * Reads JSON safely
 */
export function readJSON<T>(filePath: string, defaultValue: T): T {
  try {
    ensureJSONFile(filePath, defaultValue);
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch (error) {
    console.error('[ERROR][API][JSON][READ] -> ', error);
    return defaultValue;
  }
}

/**
 * Writes JSON safely
 */
export function writeJSON<T>(filePath: string, data: T) {
  try {
    ensureJSONFile(filePath, data);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('[ERROR][API][JSON][WRITE] -> ', error);
    throw new Error('Failed to persist data');
  }
}
