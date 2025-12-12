const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

const envPath = path.resolve(process.cwd(), '.env.local');

console.log('Checking .env.local at:', envPath);

if (fs.existsSync(envPath)) {
    console.log('File exists.');
    const result = dotenv.config({ path: envPath });
    if (result.error) {
        console.error('Error loading .env.local:', result.error);
    } else {
        console.log('Parsed variables:', Object.keys(result.parsed || {}));
    }
} else {
    console.log('File does NOT exist.');
}

console.log('DATABASE_URL value:', process.env.DATABASE_URL ? 'Found (hidden)' : 'MISSING');
