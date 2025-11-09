import { execSync } from 'child_process';
import yaml from 'js-yaml';

export interface IClipConfig {
  [key: string]: unknown;
}

export function getClipConfig(owner: string, repo: string): IClipConfig {
  try {
    const command = `gh api repos/${owner}/${repo}/contents/clip-config.yml -q .content`;
    const base64Content = execSync(command, { stdio: 'ignore' }).toString().trim();
    const clipConfig = Buffer.from(base64Content, 'base64').toString('utf8');

    return yaml.load(clipConfig) as IClipConfig;
  } catch {
    return {};
  }
}
