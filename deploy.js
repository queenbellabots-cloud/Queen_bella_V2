cat > /home/container/deploy.js << 'EOF'
/**
 * 👑 QUEEN BELLA MD - Secure Deploy
 * Downloads protected code from engine repo
 */

const fs = require('fs');
const { execSync } = require('child_process');

console.log('🔒 QUEEN BELLA MD - Secure Deployment');
console.log('📦 Downloading protected code...');

// Force HTTPS for git (fixes SSH error on Katabump)
process.env.NPM_CONFIG_GIT = 'https';
process.env.GIT_ASKPASS = 'echo';
process.env.GIT_SSH_COMMAND = 'ssh -o StrictHostKeyChecking=no';

// Create .npmrc to bypass libsignal-node SSH issue
const npmrcContent = `
git=https
@whiskeysockets:registry=https://registry.npmjs.org/
`;
fs.writeFileSync('./.npmrc', npmrcContent);

const ENGINE_REPO = 'https://github.com/ROGERS-4/engine_bella/archive/refs/heads/main.zip';

try {
    // Check if engine already downloaded
    if (!fs.existsSync('./engine_ready')) {
        console.log('🔄 Downloading engine from repo...');
        
        // Download zip
        execSync(`curl -L ${ENGINE_REPO} -o engine.zip`, { stdio: 'inherit' });
        
        // Extract
        execSync('unzip -o engine.zip', { stdio: 'inherit' });
        
        // Move files to current directory
        execSync('cp -r engine_bella-main/* .', { stdio: 'inherit' });
        execSync('cp -r engine_bella-main/.* . 2>/dev/null || true', { stdio: 'inherit' });
        
        // Clean up
        execSync('rm -rf engine_bella-main engine.zip', { stdio: 'inherit' });
        
        // Mark as done
        fs.writeFileSync('./engine_ready', 'done');
        
        console.log('✅ Engine installed successfully!');
    } else {
        console.log('✅ Engine already exists.');
    }
    
    // Install dependencies
    console.log('📦 Installing dependencies...');
    execSync('npm install --no-optional --no-package-lock', { stdio: 'inherit' });
    
    console.log('✅ Dependencies installed!');
    
    console.log('🚀 Starting QUEEN BELLA MD...');
    require('./index.js');
    
} catch (error) {
    console.error('❌ Deployment failed:', error.message);
    process.exit(1);
}
EOF