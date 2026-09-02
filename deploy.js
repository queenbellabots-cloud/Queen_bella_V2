const fs = require('fs');
const { execSync } = require('child_process');

console.log('🔒 QUEEN BELLA MD - Secure Deployment');

const ENGINE_REPO = 'https://github.com/ROGERS-4/engine_bella/archive/refs/heads/main.zip';

try {
    console.log('📦 Installing dependencies...');
    execSync('npm install --no-git --no-optional', { stdio: 'inherit' });
    
    if (!fs.existsSync('./engine_ready')) {
        console.log('📦 Downloading engine...');
        execSync(`curl -L ${ENGINE_REPO} -o engine.zip`, { stdio: 'inherit' });
        execSync('unzip -o engine.zip', { stdio: 'inherit' });
        execSync('cp -r engine_bella-main/* .', { stdio: 'inherit' });
        execSync('rm -rf engine_bella-main engine.zip', { stdio: 'inherit' });
        fs.writeFileSync('./engine_ready', 'done');
        console.log('✅ Engine installed!');
    }
    
    console.log('🚀 Starting QUEEN BELLA MD...');
    require('./index.js');
} catch (error) {
    console.error('❌ Failed:', error.message);
    process.exit(1);
}