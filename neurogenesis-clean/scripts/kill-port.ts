/**
 * Script to kill any process using port 3000
 */

import { execSync } from "child_process";

const port = 3000;

try {
  // Find the PID(s) using the port
  const result = execSync(`lsof -ti tcp:${port}`).toString().trim();
  if (result) {
    const pids = result.split("\n");
    for (const pid of pids) {
      if (pid) {
        execSync(`kill -9 ${pid}`);
        console.log(`Killed process ${pid} using port ${port}`);
      }
    }
  } else {
    console.log(`No process is using port ${port}`);
  }
} catch (error) {
  console.error(`Error killing process on port ${port}:`, error.message);
}