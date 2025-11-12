#!/usr/bin/env node

const { spawn, exec } = require('child_process');
const readline = require('readline');

const PORT = process.env.PORT || 3000;

function checkPortInUse(port) {
  return new Promise((resolve) => {
    exec(`lsof -ti:${port}`, (error, stdout) => {
      if (error) {
        resolve([]);
      } else {
        const pids = stdout.trim().split('\n').filter(pid => pid.length > 0);
        resolve(pids);
      }
    });
  });
}

function killProcess(pid) {
  return new Promise((resolve) => {
    exec(`kill -9 ${pid}`, (error) => {
      resolve(!error);
    });
  });
}

async function killAllProcesses(pids) {
  let allKilled = true;
  for (const pid of pids) {
    console.log(`🔪 Killing process ${pid}...`);
    const killed = await killProcess(pid);
    if (!killed) {
      console.log(`❌ Failed to kill process ${pid}`);
      allKilled = false;
    } else {
      console.log(`✅ Process ${pid} killed successfully`);
    }
  }
  return allKilled;
}

function askUser(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.toLowerCase().trim());
    });
  });
}

async function startApp() {
  const pids = await checkPortInUse(PORT);

  if (pids.length > 0) {
    console.log(`\n🚨 Port ${PORT} is already in use by process(es): ${pids.join(', ')}`);
    const answer = await askUser(`Kill ${pids.length === 1 ? 'the process' : 'all processes'} and continue? (y/n): `);

    if (answer === 'y' || answer === 'yes') {
      const allKilled = await killAllProcesses(pids);

      if (allKilled) {
        console.log(`🚀 Starting the app on port ${PORT}...\n`);
      } else {
        console.log(`❌ Some processes could not be killed. Please check manually.`);
        process.exit(1);
      }
    } else {
      console.log(`🛑 Aborted. Please free port ${PORT} manually.`);
      process.exit(1);
    }
  }

  // Start the React app
  const reactScript = spawn('react-scripts', ['start'], {
    stdio: 'inherit',
    env: {
      ...process.env,
      GENERATE_SOURCEMAP: 'false'
    }
  });

  reactScript.on('close', (code) => {
    process.exit(code);
  });
}

startApp().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});