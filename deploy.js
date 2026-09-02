cat > /home/container/deploy.js << 'EOF'
const fs = require('fs');
const { execSync } = require('child_process');

console.log('🔒 QUEEN BELLA MD - Secure Deployment');

process.env.NPM_CONFIG_GIT = 'https';
process.env.GIT_ASKPASS = 'echo';
process.env.GIT_SSH_COMMAND = 'ssh -o StrictHostKeyChecking=no';

const npmrcContent = `
git=https
@whiskeysockets:registry=https://registry.npmjs.org/
`;
fs.writeFileSync('./.npmrc', npmrcContent);

const ENGINE_REPO = 'https://github.com/ROGERS-4/engine_bella/archive/refs/heads/main.zip';

try {
    if (!fs.existsSync('./engine_ready')) {
        console.log('📦 Downloading engine...');
        execSync(`curl -L ${ENGINE_REPO} -o engine.zip`, { stdio: 'inherit' });
        execSync('unzip -o engine.zip', { stdio: 'inherit' });
        execSync('cp -r engine_bella-main/* .', { stdio: 'inherit' });
        execSync('rm -rf engine_bella-main engine.zip', { stdio: 'inherit' });
        fs.writeFileSync('./engine_ready', 'done');
        console.log('✅ Engine installed!');
    }
    
    console.log('📦 Installing dependencies...');
    execSync('npm install --no-optional --no-package-lock', { stdio: 'inherit' });
    
    console.log('🚀 Starting QUEEN BELLA MD...');
    require('./index.js');
} catch (error) {
    console.error('❌ Failed:', error.message);
    process.exit(1);
}
EOF