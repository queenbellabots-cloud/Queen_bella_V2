/**
 * 👑 QUEEN BELLA MD - Secure Deploy
 * Downloads protected code from engine repo
 */

const fs = require('fs');
const { execSync } = require('child_process');

console.log('🔒 QUEEN BELLA MD - Secure Deployment');
console.log('📦 Downloading protected code...');

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
    console.log('💡 Make sure you have: curl, unzip installed');
    process.exit(1);
}