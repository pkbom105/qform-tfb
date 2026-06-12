import fs from "fs";
import path from "path";

const LOG_FILE = path.join(process.cwd(), "pg-disconnect.log");

export interface DisconnectLogEntry {
  timestamp: string;
  message: string;
}

/**
 * Append a disconnect event to the log file
 */
export function logDisconnect(message: string) {
  try {
    const timestamp = new Date().toISOString();
    const line = `[${timestamp}] ${message}\n`;
    fs.appendFileSync(LOG_FILE, line, "utf-8");
  } catch (err) {
    console.error("Failed to write disconnect log:", err);
  }
}

/**
 * Read recent disconnect log entries (last N lines)
 */
export function readDisconnectLogs(maxLines = 50): DisconnectLogEntry[] {
  try {
    if (!fs.existsSync(LOG_FILE)) return [];

    const content = fs.readFileSync(LOG_FILE, "utf-8");
    const lines = content.trim().split("\n").filter(Boolean);

    // Take the last N lines (most recent first)
    const recent = lines.slice(-maxLines).reverse();

    return recent.map((line) => {
      // Parse "[timestamp] message"
      const match = line.match(/^\[(.*?)\] (.*)$/);
      if (match) {
        return { timestamp: match[1], message: match[2] };
      }
      return { timestamp: "", message: line };
    });
  } catch (err) {
    console.error("Failed to read disconnect log:", err);
    return [];
  }
}