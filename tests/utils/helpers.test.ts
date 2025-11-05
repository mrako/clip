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
    // Verify that the command is logged with proper formatting (separators, $ prefix, and command text)
    expect(mockConsoleLog).toHaveBeenCalledWith(expect.stringContaining('─'.repeat(80)));
    expect(mockConsoleLog).toHaveBeenCalledWith(expect.stringMatching(/\$.*test command/));
  });

  it('should exit process when command fails and continueOnError is false', () => {
    mockExecSync.mockImplementation(() => {
      throw new Error('Command failed');
    });

    expect(() => {
      runCommand('failing command');
    }).toThrow('process.exit called');

    // Verify error message includes the ✗ symbol and command name
    expect(mockConsoleError).toHaveBeenCalledWith(
      expect.stringContaining('✗ Error executing command:'),
      'failing command'
    );
    expect(mockConsoleError).toHaveBeenCalledWith(
      expect.stringContaining('Command failed')
    );
    expect(mockProcessExit).toHaveBeenCalledWith(1);
  });

  it('should not exit process when command fails and continueOnError is true', () => {
    mockExecSync.mockImplementation(() => {
      throw new Error('Command failed');
    });

    runCommand('failing command', { continueOnError: true });

    // Verify error message includes the ✗ symbol and command name
    expect(mockConsoleError).toHaveBeenCalledWith(
      expect.stringContaining('✗ Error executing command:'),
      'failing command'
    );
    expect(mockConsoleError).toHaveBeenCalledWith(
      expect.stringContaining('Command failed')
    );
    expect(mockProcessExit).not.toHaveBeenCalled();
  });

  it('should redact command when logging is false', () => {
    mockExecSync.mockReturnValue(Buffer.from(''));

    runCommand('secret command', { logging: false });

    // Verify command is redacted
    expect(mockConsoleLog).toHaveBeenCalledWith(expect.stringContaining('[REDACTED]'));
    expect(mockConsoleLog).not.toHaveBeenCalledWith(expect.stringContaining('secret command'));
  });
});
