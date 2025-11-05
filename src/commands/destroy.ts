import dotenv from 'dotenv';
import fs from 'fs';
import readline from 'readline';

import { runCommand } from '../utils/helpers.js';
import { colors } from '../utils/colors.js';

dotenv.config();

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
    // Use red text for the question, matching Vercel CLI style
    rl.question(`${colors.red}⚠  ${prompt} [y/N]: ${colors.reset}`, (answer) => {
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
    console.log(`${colors.dim}${'─'.repeat(80)}${colors.reset}`);
    console.log(`${colors.cyan}$${colors.reset} ${colors.bold}Removing local directory${colors.reset}`);
    console.log(`${colors.dim}${'─'.repeat(80)}${colors.reset}`);
    console.log(`✓ Found directory "${projectName}"`);
    const shouldRemove = await confirm(`Directory "${projectName}" exists, do you want to remove it?`);
    if (shouldRemove) {
      runCommand(`rm -rf ${projectName}`);
      console.log('');
      console.log(`✓ Removed "${projectName}".`);
    } else {
      console.log('Skipped directory removal.');
    }
  }
}
