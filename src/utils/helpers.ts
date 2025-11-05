import { execSync } from 'child_process';

interface ICommandOptions {
  logging?: boolean;
  stdio?: 'inherit' | 'pipe' | 'ignore';
  continueOnError?: boolean;
}

// ANSI color codes for terminal formatting
const colors = {
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  reset: '\x1b[0m',
};

export function runCommand(command: string, { logging = true, continueOnError = false, ...options }: ICommandOptions = { stdio: 'inherit' }): void {
  try {
    // Display command being executed with clear formatting
    console.log(`${colors.dim}${'─'.repeat(80)}${colors.reset}`);
    if (logging) {
      console.log(`${colors.cyan}$${colors.reset} ${colors.bold}${command}${colors.reset}`);
    } else {
      console.log(`${colors.cyan}$${colors.reset} ${colors.bold}[REDACTED]${colors.reset}`);
    }
    console.log(`${colors.dim}${'─'.repeat(80)}${colors.reset}`);

    execSync(command, { stdio: 'inherit', ...options });
    
    // Add spacing after command output
    console.log('');
  } catch (error) {
    console.log('');
    console.error(`${colors.red}✗ Error executing command:${colors.reset}`, logging ? command : '[REDACTED]');
    console.error(`${colors.red}  ${(error as Error).message}${colors.reset}`);
    if (!continueOnError) {
      process.exit(1);
    }
  }
}
