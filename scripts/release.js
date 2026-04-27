#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

try {
  // Get current branch
  const branch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf-8' }).trim();

  // Validate branch
  if (branch !== 'main' && !branch.startsWith('release/')) {
    console.error('❌ Error: Can only release from \'main\' or \'release/*\' branches');
    console.error(`Current branch: ${branch}`);
    process.exit(1);
  }

  // Get version from package.json
  const packageJsonPath = path.join(__dirname, 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
  const version = `v${packageJson.version}`;

  // Determine make_latest based on branch
  const makeLatest = branch === 'main' ? 'true' : 'false';

  console.log(`Branch: ${branch}`);
  console.log(`Version: ${version}`);
  console.log(`Make Latest: ${makeLatest}`);
  console.log('');

  // Check if glab is installed
  try {
    execSync('which glab', { stdio: 'ignore' });
  } catch {
    console.error('❌ Error: glab CLI is not installed. See: https://docs.gitlab.com/cli/');
    process.exit(1);
  }

  // Trigger GitLab pipeline
  console.log('Triggering GitLab pipeline...');
  execSync(
    `glab ci run -R infrastructure/release-tool/axelor-goovee-release -b main --variables GOOVEE_VERSION:${version} --variables MAKE_LATEST:${makeLatest}`,
    { stdio: 'inherit' }
  );

  console.log('Pipeline triggered successfully!');
} catch (error) {
  console.error('Error:', error.message);
  process.exit(1);
}
