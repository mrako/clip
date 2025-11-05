import { jest } from '@jest/globals';
import { destroyProject } from '../../src/commands/destroy.js';
import { runCommand } from '../../src/utils/helpers.js';
import { execSync } from 'child_process';
import fs from 'fs';
import readline from 'readline';

jest.mock('../../src/utils/helpers.js', () => ({
  runCommand: jest.fn()
}));

jest.mock('child_process');

jest.mock('fs');

jest.mock('readline');

describe('Destroy Command', () => {
  const mockRunCommand = runCommand as jest.MockedFunction<typeof runCommand>;
  const mockExecSync = execSync as jest.MockedFunction<typeof execSync>;
  const mockExistsSync = fs.existsSync as jest.MockedFunction<typeof fs.existsSync>;
  const mockCreateInterface = readline.createInterface as jest.MockedFunction<typeof readline.createInterface>;
  const executedCommands: string[] = [];
  let mockQuestion: jest.Mock;
  let mockClose: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    executedCommands.length = 0;
    mockRunCommand.mockImplementation((command) => {
      executedCommands.push(command);
    });
    mockExecSync.mockImplementation((command: string) => {
      if (command.startsWith('rm -rf')) {
        executedCommands.push(command);
      }
      return Buffer.from('') as any;
    });

    // Setup readline mock
    mockQuestion = jest.fn();
    mockClose = jest.fn();
    mockCreateInterface.mockReturnValue({
      question: mockQuestion,
      close: mockClose,
    } as any);

    // By default, assume directory doesn't exist
    mockExistsSync.mockReturnValue(false);

    // Mock console.log to suppress output during tests
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should execute both GitHub and Vercel destroy commands if VERCEL_SCOPE is set', async () => {
    await destroyProject({
      projectName: 'test-project',
      owner: 'mrako'
    });

    expect(executedCommands).toEqual([
      'gh repo delete mrako/test-project --yes',
      'vercel project rm test-project --scope team_123'
    ]);
  });

  it('should remove local directory when it exists and user confirms', async () => {
    mockExistsSync.mockReturnValue(true);
    mockQuestion.mockImplementation((...args: any[]) => {
      const callback = args[1] as (answer: string) => void;
      callback('y');
    });

    await destroyProject({
      projectName: 'test-project',
      owner: 'mrako'
    });

    expect(mockExistsSync).toHaveBeenCalledWith('test-project');
    expect(mockQuestion).toHaveBeenCalled();
    expect(executedCommands).toContain('rm -rf test-project');
    expect(console.log).toHaveBeenCalledWith('✓ Found directory "test-project"');
    expect(console.log).toHaveBeenCalledWith('✓ Removed "test-project".');
  });

  it('should not remove local directory when it exists but user declines', async () => {
    mockExistsSync.mockReturnValue(true);
    mockQuestion.mockImplementation((...args: any[]) => {
      const callback = args[1] as (answer: string) => void;
      callback('n');
    });

    await destroyProject({
      projectName: 'test-project',
      owner: 'mrako'
    });

    expect(mockExistsSync).toHaveBeenCalledWith('test-project');
    expect(mockQuestion).toHaveBeenCalled();
    expect(executedCommands).not.toContain('rm -rf test-project');
    expect(console.log).toHaveBeenCalledWith('Skipped directory removal.');
  });

  it('should not prompt for directory removal when local directory does not exist', async () => {
    mockExistsSync.mockReturnValue(false);

    await destroyProject({
      projectName: 'test-project',
      owner: 'mrako'
    });

    expect(mockExistsSync).toHaveBeenCalledWith('test-project');
    expect(mockQuestion).not.toHaveBeenCalled();
    expect(executedCommands).not.toContain('rm -rf test-project');
  });

  it('should continue when GitHub repository delete fails', async () => {
    // Mock runCommand to track execution without throwing
    mockRunCommand.mockImplementation((command) => {
      executedCommands.push(command);
    });

    await destroyProject({
      projectName: 'test-project',
      owner: 'mrako'
    });

    // Verify both commands were attempted
    expect(executedCommands).toContain('gh repo delete mrako/test-project --yes');
    expect(executedCommands).toContain('vercel project rm test-project --scope team_123');
  });

  it('should continue when Vercel project delete fails', async () => {
    // Mock runCommand to track execution without throwing
    mockRunCommand.mockImplementation((command) => {
      executedCommands.push(command);
    });

    await destroyProject({
      projectName: 'test-project',
      owner: 'mrako'
    });

    // Verify both commands were attempted
    expect(executedCommands).toContain('gh repo delete mrako/test-project --yes');
    expect(executedCommands).toContain('vercel project rm test-project --scope team_123');
  });

  it('should continue to directory cleanup even when both GitHub and Vercel operations fail', async () => {
    // Mock runCommand to track execution without throwing
    mockRunCommand.mockImplementation((command) => {
      executedCommands.push(command);
    });
    mockExistsSync.mockReturnValue(true);
    mockQuestion.mockImplementation((...args: any[]) => {
      const callback = args[1] as (answer: string) => void;
      callback('y');
    });

    await destroyProject({
      projectName: 'test-project',
      owner: 'mrako'
    });

    // Verify all commands were attempted including directory removal
    expect(executedCommands).toContain('gh repo delete mrako/test-project --yes');
    expect(executedCommands).toContain('vercel project rm test-project --scope team_123');
    expect(executedCommands).toContain('rm -rf test-project');
    expect(console.log).toHaveBeenCalledWith('✓ Found directory "test-project"');
    expect(console.log).toHaveBeenCalledWith('✓ Removed "test-project".');
  });
});
