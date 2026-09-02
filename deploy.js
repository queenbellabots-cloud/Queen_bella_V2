/**
 * QUEEN BELLA MD - Secure Deploy
 */

// 🔧 Force HTTPS for git (fixes SSH error)
process.env.NPM_CONFIG_GIT = 'https';

const fs = require('fs');
const { execSync } = require('child_process');

console.log('🔒 QUEEN BELLA MD - Secure Deployment');
console.log('📦 Downloading protected code...');

const ENGINE_REPO = 'https://github.com/ROGERS-4/engine_bella/archive/refs/heads/main.zip';

try {
    // Check if engine already downloaded
    if (!fs.existsSync('./engine_ready')) {
        console.log('🔄 Downloading engine...');
        
        // Download
        execSync(`curl -L ${ENGINE_REPO} -o engine.zip`, { stdio: 'inherit' });
        
        // Extract
        execSync('unzip -o engine.zip', { stdio: 'inherit' });
        
        // Move files
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
    
    console.log('🚀 Starting QUEEN BELLA MD...');
    require('./index.js');
    
} catch (error) {
    console.error('❌ Deployment failed:', error.message);
    process.exit(1);
}