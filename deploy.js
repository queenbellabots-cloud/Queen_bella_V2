cat > /home/container/deploy.js << 'EOF'
/**
 * 👑 QUEEN BELLA MD - Secure Deploy
 * Downloads protected code from engine repo
 */

const fs = require('fs');
const { execSync } = require('child_process');

console.log('🔒 QUEEN BELLA MD - Secure Deployment');
console.log('📦 Downloading protected code...');

const ENGINE_REPO = 'https://github.com/ROGERS-4/engine_bella/archive/main.zip';

try {
    if (!fs.existsSync('./index.js')) {
        console.log('🔄 Downloading protected code from engine repo...');
        execSync(`curl -L ${ENGINE_REPO} -o engine.zip`, { stdio: 'inherit' });
        execSync('unzip -o engine.zip', { stdio: 'inherit' });
        execSync('cp -r engine_bella-main/* .', { stdio: 'inherit' });
        execSync('rm -rf engine_bella-main engine.zip', { stdio: 'inherit' });
        console.log('✅ Protected code installed successfully!');
    } else {
        console.log('✅ Protected code already exists.');
    }
    
    console.log('🚀 Starting QUEEN BELLA MD...');
    require('./index.js');
    
} catch (error) {
    console.error('❌ Deployment failed:', error.message);
    process.exit(1);
}
EOF