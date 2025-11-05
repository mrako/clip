import { execSync } from 'child_process';

interface ICommandOptions {
  logging?: boolean;
  stdio?: 'inherit' | 'pipe' | 'ignore';
  continueOnError?: boolean;
}

export function runCommand(command: string, { logging = true, continueOnError = false, ...options }: ICommandOptions = { stdio: 'inherit' }): void {
  try {
    if (logging) {
      console.log(`Running command: ${command}`);
    } else {
      console.log('Running command: [REDACTED]');
    }

    execSync(command, { stdio: 'inherit', ...options });
  } catch (error) {
    console.error(`Error executing command: ${command}`, (error as Error).message);
    if (!continueOnError) {
      process.exit(1);
    }
  }
}
