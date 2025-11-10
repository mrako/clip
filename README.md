# Minimum Viable Platform Engineering


## Usage

```bash
npx @mrako/clip [command]

Commands:
  npx @mrako/clip create <projectName>  Create a new project with GitHub template
  npx @mrako/clip destroy <projectName>  Destroy a project and its deployment

Options:
      --version   Show version number                                  [boolean]
  -t, --template  GitHub repository template name            [string] [required]
  -d, --domain    Target domain name for the project         [string] [optional]
  -p, --private   Create the repository as private                     [boolean]
  -h, --help      Show help                                            [boolean]
```

## Development

### Installation

```bash
npm install
npm link
```

### Testing

```bash
npm test
```

### Publishing

Publishing is automated using GitHub Actions and [Release Please](https://github.com/googleapis/release-please).
