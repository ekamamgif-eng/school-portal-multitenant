const fs = require('fs');
const path = require('path');

const envPath = path.join(process.cwd(), '.env.local');

try {
    const content = fs.readFileSync(envPath, 'utf8');
    console.log('--- RAW CONTENT START ---');
    console.log(content);
    console.log('--- RAW CONTENT END ---');
} catch (err) {
    console.error('Error reading file:', err.message);
}
