import dotenv from 'dotenv';
import fs from 'fs';
import readline from 'readline';

import { runCommand } from '../utils/helpers.js';

dotenv.config();

// ANSI color codes for terminal formatting
const colors = {
  yellow: '\x1b[33m',
  bold: '\x1b[1m',
  reset: '\x1b[0m',
};

export interface IDestroyArgs {
  projectName: string;
  owner: string;
}

const VERCEL_SCOPE = process.env.VERCEL_SCOPE;

async function confirm(prompt: string): Promise<boolean> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) => {
    console.log('');
    console.log(`${colors.yellow}${'━'.repeat(80)}${colors.reset}`);
    console.log(`${colors.yellow}⚠${colors.reset}  ${colors.bold}${colors.yellow}${prompt}${colors.reset}`);
    rl.question(`${colors.yellow}  [y/N]: ${colors.reset}`, (answer) => {
      console.log(`${colors.yellow}${'━'.repeat(80)}${colors.reset}`);
      console.log('');
      rl.close();
      resolve(answer.toLowerCase() === 'y');
    });
  });
}

export async function destroyProject({ projectName, owner }: IDestroyArgs): Promise<void> {
  runCommand(`gh repo delete ${owner}/${projectName} --yes`, { continueOnError: true });
  if (VERCEL_SCOPE) {
    runCommand(`vercel project rm ${projectName} --scope ${VERCEL_SCOPE}`, { continueOnError: true });
  }

  if (fs.existsSync(projectName)) {
    const shouldRemove = await confirm(`Directory "${projectName}" exists, do you want to remove it?`);
    if (shouldRemove) {
      runCommand(`rm -rf ${projectName}`);
      console.log(`Removed "${projectName}".`);
    } else {
      console.log('Skipped directory removal.');
    }
  }
}
