# Minimum Viable Platform Engineering


## Installation

```bash
npm install
npm link
```

## Usage

```bash
clip [command]

Commands:
  clip create <projectName>  Create a new project with GitHub template
  clip destroy <projectName>  Destroy a project and its deployment

Options:
      --version   Show version number                                  [boolean]
  -t, --template  GitHub repository template name            [string] [required]
  -d, --domain    Target domain name for the project         [string] [optional]
  -p, --private   Create the repository as private                     [boolean]
  -h, --help      Show help                                            [boolean]
```

## Development

### Versioning and Releases

This project uses [Release Please](https://github.com/googleapis/release-please) for automated versioning and releases.

**How it works:**
- When commits are pushed to the `main` branch, Release Please analyzes commit messages
- It creates or updates a release PR with changelog and version bump
- When the release PR is merged, a new GitHub release is created and the package is published to npm

**Commit Message Convention:**

Follow [Conventional Commits](https://www.conventionalcommits.org/) for automatic versioning:

- `fix:` - Bug fixes (patch version bump: 1.0.0 → 1.0.1)
- `feat:` - New features (minor version bump: 1.0.0 → 1.1.0)
- `BREAKING CHANGE:` - Breaking changes (major version bump: 1.0.0 → 2.0.0)
- `chore:`, `docs:`, `style:`, `refactor:`, `test:`, `ci:` - No version bump

**Example commit messages:**
```bash
fix: resolve issue with template creation
feat: add support for custom domains
feat!: change CLI argument structure (BREAKING CHANGE)
chore: update dependencies
```

**Manual Release Process:**
1. Make commits following the conventional commit format
2. Push to `main` branch
3. Wait for Release Please to create/update a release PR
4. Review the release PR (check version bump and changelog)
5. Merge the release PR to trigger the release and npm publish

