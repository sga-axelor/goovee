import path from 'path';
import {fileURLToPath} from 'url';
import {seedTemplates} from '@/subapps/website/common/utils/templates';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const tenantId = process.argv[2];

if (!tenantId) {
  console.error('\x1b[31m✖ Tenant id is required.\x1b[0m');
  process.exit(1);
}

try {
  await seedTemplates({tenantId, templatesDir: __dirname});
  console.log('\x1b[32m🔥 Success:\x1b[0m Templates seeded successfully!');
} catch (e) {
  console.error(e);
  process.exit(1);
}
