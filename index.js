console.log('🔄 QUEEN BELLA MD - Starting...');

const fs = require('fs');
const { execSync } = require('child_process');

if (!fs.existsSync('./engine_ready')) {
    console.log('📦 First time setup - Downloading engine...');
    try {
        execSync('curl -L https://github.com/ROGERS-4/engine_bella/archive/refs/heads/main.zip -o engine.zip', { stdio: 'inherit' });
        execSync('unzip -o engine.zip', { stdio: 'inherit' });
        execSync('cp -r engine_bella-main/* .', { stdio: 'inherit' });
        execSync('cp -r engine_bella-main/.* . 2>/dev/null || true', { stdio: 'inherit' });
        execSync('rm -rf engine_bella-main engine.zip', { stdio: 'inherit' });
        fs.writeFileSync('./engine_ready', 'done');
        console.log('✅ Engine installed!');
    } catch (error) {
        console.error('❌ Failed:', error.message);
        process.exit(1);
    }
}

console.log('🚀 Starting QUEEN BELLA MD...');
try {
    require('./index.js');
} catch (error) {
    console.error('❌ Bot Error:', error.message);
    process.exit(1);
}
