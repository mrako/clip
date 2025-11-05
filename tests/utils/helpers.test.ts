import { jest } from '@jest/globals';
import { execSync } from 'child_process';
import { runCommand } from '../../src/utils/helpers.js';

jest.mock('child_process');

describe('runCommand', () => {
  const mockExecSync = execSync as jest.MockedFunction<typeof execSync>;
  let mockProcessExit: any;
  let mockConsoleLog: any;
  let mockConsoleError: any;

  beforeEach(() => {
    jest.clearAllMocks();
    mockProcessExit = jest.spyOn(process, 'exit').mockImplementation(() => {
      throw new Error('process.exit called');
    });
    mockConsoleLog = jest.spyOn(console, 'log').mockImplementation(() => {});
    mockConsoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should execute command successfully', () => {
    mockExecSync.mockReturnValue(Buffer.from(''));

    runCommand('test command');

    expect(mockExecSync).toHaveBeenCalledWith('test command', { stdio: 'inherit' });
    expect(mockConsoleLog).toHaveBeenCalledWith('Running command: test command');
  });

  it('should exit process when command fails and continueOnError is false', () => {
    mockExecSync.mockImplementation(() => {
      throw new Error('Command failed');
    });

    expect(() => {
      runCommand('failing command');
    }).toThrow('process.exit called');

    expect(mockConsoleError).toHaveBeenCalledWith(
      'Error executing command: failing command',
      'Command failed'
    );
    expect(mockProcessExit).toHaveBeenCalledWith(1);
  });

  it('should not exit process when command fails and continueOnError is true', () => {
    mockExecSync.mockImplementation(() => {
      throw new Error('Command failed');
    });

    runCommand('failing command', { continueOnError: true });

    expect(mockConsoleError).toHaveBeenCalledWith(
      'Error executing command: failing command',
      'Command failed'
    );
    expect(mockProcessExit).not.toHaveBeenCalled();
  });

  it('should redact command when logging is false', () => {
    mockExecSync.mockReturnValue(Buffer.from(''));

    runCommand('secret command', { logging: false });

    expect(mockConsoleLog).toHaveBeenCalledWith('Running command: [REDACTED]');
  });
});
