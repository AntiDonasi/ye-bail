# Version Management & Release Process

This document describes the semantic versioning and release process for ye-bail.

## Semantic Versioning

This project follows [Semantic Versioning](https://semver.org/):
- **MAJOR** version for incompatible API changes
- **MINOR** version for backwards-compatible functionality additions
- **PATCH** version for backwards-compatible bug fixes

## Release Scripts

### Automated Release with release-it

The project uses [release-it](https://github.com/release-it/release-it) for automated releases.

#### Patch Release (0.4.2 → 0.4.3)
```bash
npm run release:patch
# or
yarn release:patch
```

#### Minor Release (0.4.3 → 0.5.0)
```bash
npm run release:minor
# or
yarn release:minor
```

#### Major Release (0.4.3 → 1.0.0)
```bash
npm run release:major
# or
yarn release:major
```

#### Interactive Release (choose version manually)
```bash
npm run release
# or
yarn release
```

## Release Process

When you run a release command, the following happens automatically:

1. **Pre-release checks**
   - Runs linter (`npm run lint`)
   - Builds TypeScript (`npm run build:tsc`)

2. **Version bump**
   - Updates `package.json` version
   - Updates `CHANGELOG.md` with conventional commits
   - Creates git commit with message: `chore: release v{version}`

3. **Git operations**
   - Creates git tag `v{version}`
   - Pushes commit and tag to remote

4. **GitHub Release**
   - Creates GitHub release with the tag
   - Uses CHANGELOG.md content for release notes

## CI/CD Workflows

### Continuous Integration (CI)
**Trigger:** Push to `main` branch or pull requests
**Actions:**
- Tests on Node.js 20.x and 22.x
- Runs linter
- Runs tests
- Builds TypeScript

### NPM Publish
**Trigger:** Push git tag matching `v*` (e.g., `v0.4.3`)
**Actions:**
- Runs linter and tests
- Builds TypeScript
- Publishes to NPM with provenance
- Creates GitHub release

## Setup Requirements

### NPM Token
To publish to NPM, you need to set up the `NPM_TOKEN` secret in GitHub:

1. Generate NPM token:
   - Go to [npmjs.com](https://www.npmjs.com/)
   - Navigate to Access Tokens
   - Generate new token (Automation type recommended)

2. Add to GitHub:
   - Go to repository Settings → Secrets and variables → Actions
   - Add new repository secret: `NPM_TOKEN`
   - Paste your NPM token

### GitHub Token
The `GITHUB_TOKEN` is automatically provided by GitHub Actions - no setup needed.

## Manual Version Bump

If you need to manually bump the version without releasing:

```bash
# Update version in package.json
npm version patch  # or minor, or major

# This will automatically:
# - Update CHANGELOG.md
# - Create a git commit
# - Create a git tag
```

## Conventional Commits

This project uses conventional commits for automatic changelog generation:

- `feat:` - New feature (minor version bump)
- `fix:` - Bug fix (patch version bump)
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `perf:` - Performance improvements
- `test:` - Test additions or changes
- `chore:` - Build process or auxiliary tool changes
- `BREAKING CHANGE:` - Breaking changes (major version bump)

Example:
```bash
git commit -m "feat: add new button message support"
git commit -m "fix: resolve media key handling issue"
git commit -m "docs: update installation instructions"
```

## Troubleshooting

### Release fails at lint/test
Make sure all linting and tests pass before releasing:
```bash
npm run lint:fix
npm test
```

### Cannot push to remote
Ensure you have push access to the repository and your local branch is up to date:
```bash
git pull --rebase origin main
```

### NPM publish fails
- Check that `NPM_TOKEN` is correctly set in GitHub secrets
- Verify you have publish permissions for the `ye-bail` package
- Ensure the version doesn't already exist on NPM
