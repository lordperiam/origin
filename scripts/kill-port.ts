/**
 * Script to kill any process using port 3000
 */

import { exec } from "child_process"
import { promisify } from "util"

const execAsync = promisify(exec)

async function killPort(port: number) {
  try {
    // Find process using the port
    const { stdout } = await execAsync(`lsof -i :${port} -t`)
    const pid = stdout.trim()

    if (pid) {
      // Kill the process
      await execAsync(`kill -9 ${pid}`)
      console.log(`Successfully killed process ${pid} using port ${port}`)
    } else {
      console.log(`No process found using port ${port}`)
    }
  } catch (error) {
    if ((error as any).code === 1) {
      console.log(`No process found using port ${port}`)
    } else {
      console.error("Error killing port:", error)
    }
  }
}

// Kill port 3000
killPort(3000).catch(console.error) 