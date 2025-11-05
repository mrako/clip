import { execSync } from 'child_process';
import { colors } from './colors.js';

interface ICommandOptions {
  logging?: boolean;
  stdio?: 'inherit' | 'pipe' | 'ignore';
  continueOnError?: boolean;
  showSeparators?: boolean;
}

export function runCommand(command: string, { logging = true, continueOnError = false, showSeparators = true, ...options }: ICommandOptions = { stdio: 'inherit' }): void {
  try {
    // Display command being executed with clear formatting
    if (showSeparators) {
      console.log(`${colors.dim}${'─'.repeat(80)}${colors.reset}`);
    }
    if (logging) {
      const prefix = showSeparators ? `${colors.cyan}$${colors.reset}` : `  ${colors.cyan}$${colors.reset}`;
      console.log(`${prefix} ${colors.bold}${command}${colors.reset}`);
    } else {
      const prefix = showSeparators ? `${colors.cyan}$${colors.reset}` : `  ${colors.cyan}$${colors.reset}`;
      console.log(`${prefix} ${colors.bold}[REDACTED]${colors.reset}`);
    }
    if (showSeparators) {
      console.log(`${colors.dim}${'─'.repeat(80)}${colors.reset}`);
    }

    execSync(command, { stdio: 'inherit', ...options });
    
    // Add spacing after command output
    if (showSeparators) {
      console.log('');
    }
  } catch (error) {
    console.log('');
    console.error(`${colors.red}✗ Error executing command:${colors.reset}`, logging ? command : '[REDACTED]');
    console.error(`${colors.red}  ${(error as Error).message}${colors.reset}`);
    if (!continueOnError) {
      process.exit(1);
    }
  }
}
