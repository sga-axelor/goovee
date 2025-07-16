import {config as loadDotenv} from 'dotenv';
import {existsSync} from 'fs';
import path from 'path';

/**
 * Loads .env files with Next.js-style precedence:
 * 1. .env.local
 * 2. .env.[mode].local
 * 3. .env.[mode]
 * 4. .env
 *
 * Later files do NOT override previously loaded variables.
 */
function loadEnv(cwd: string = process.cwd()) {
  const dotenvFiles = ['.env.swc.local', `.env.swc.production`, '.env.swc'];

  for (const file of dotenvFiles) {
    const fullPath = path.join(cwd, file);
    if (existsSync(fullPath)) {
      loadDotenv({path: fullPath, override: false}); // Do not override already loaded values
    }
  }
}

loadEnv();
