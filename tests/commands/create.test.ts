import { jest } from '@jest/globals';
import { createProject } from '../../src/commands/create.js';
import { runCommand } from '../../src/utils/helpers.js';

jest.mock('../../src/utils/config.js', () => ({
  getClipConfig: jest.fn().mockReturnValue({})
}));

jest.mock('../../src/utils/helpers.js', () => ({
  runCommand: jest.fn()
}));

jest.mock('child_process', () => ({
  execSync: jest.fn().mockReturnValue('test-user')
}));

describe('Create Command', () => {
  const mockRunCommand = runCommand as jest.MockedFunction<typeof runCommand>;
  const executedCommands: string[] = [];

  beforeEach(() => {
    jest.clearAllMocks();
    executedCommands.length = 0;

    mockRunCommand.mockImplementation((command) => {
      executedCommands.push(command);
    });
  });

  it('should execute the expected commands in correct order', async () => {
    await createProject({
      _: [],
      $0: 'test',
      projectName: 'test-project',
      template: 'test-template'
    });

    expect(executedCommands).toEqual([
      'gh repo create test-project --template test-template --public',
      'gh repo clone test-project'
    ]);
  });

  it('should call gh repo create without continueOnError option', async () => {
    await createProject({
      _: [],
      $0: 'test',
      projectName: 'test-project',
      template: 'test-template'
    });

    expect(mockRunCommand).toHaveBeenCalledWith(
      'gh repo create test-project --template test-template --public'
    );
  });

  it('should call gh repo clone with continueOnError option', async () => {
    await createProject({
      _: [],
      $0: 'test',
      projectName: 'test-project',
      template: 'test-template'
    });

    expect(mockRunCommand).toHaveBeenCalledWith(
      'gh repo clone test-project',
      { continueOnError: true }
    );
  });

  it('should return the correct repo name in username/projectName format', async () => {
    const repoName = await createProject({
      _: [],
      $0: 'test',
      projectName: 'test-project',
      template: 'test-template'
    });

    expect(repoName).toBe('test-user/test-project');
  });
});
