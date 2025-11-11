import { execSync } from 'child_process';

import { runCommand } from '../utils/helpers.js';

export interface ICreateArgs {
  _: (string | number)[];
  $0: string;
  projectName: string;
  template: string;
  domain?: string;
  private?: boolean;
}

function getRepoName(projectName: string): string {
  try {
    const username = execSync('gh api user -q .login').toString().trim();
    return `${username}/${projectName}`;
  } catch (error) {
    console.error('Error retrieving GitHub username:', (error as Error).message);
    process.exit(1);
  }
}

export async function createProject({ projectName, template, private: isPrivate }: ICreateArgs): Promise<string> {
  const visibilityFlag = isPrivate ? '--private' : '--public';
  runCommand(`gh repo create ${projectName} --template ${template} ${visibilityFlag}`);
  runCommand(`gh repo clone ${projectName}`, { continueOnError: true });

  return getRepoName(projectName);
}
