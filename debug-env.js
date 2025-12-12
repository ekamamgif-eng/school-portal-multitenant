const { loadEnvConfig } = require('@next/env');

const projectDir = process.cwd();
console.log('Loading environment from ' + projectDir);
loadEnvConfig(projectDir);

const keyName = 'NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY';
const val = process.env[keyName];

if (val) {
    console.log(`✅ ${keyName} is FOUND.`);
    console.log(`Length: ${val.length}`);
    console.log(`Value starts with: ${val.substring(0, 10)}...`);
} else {
    console.log(`❌ ${keyName} is MISSING.`);
}
