/**
 * 🔒 QUEEN BELLA MD - Secure Deploy
 * Downloads protected code from engine repo
 */

const fs = require('fs');
const { execSync } = require('child_process');

console.log('🔒 QUEEN BELLA MD - Secure Deployment');
console.log('📦 Downloading protected code...');

// ═══════════════════════════════════════════════════════
// 🔧 CHANGE THIS TO YOUR ENGINE REPO URL
// ═══════════════════════════════════════════════════════
const ENGINE_REPO = 'https://github.com/ROGERS-4/engine_bella/main.zip';

try {
    // Check if bot files already exist
    if (!fs.existsSync('./index.js')) {
        console.log('🔄 Downloading protected code from engine repo...');
        
        // Download zip
        execSync(`curl -L ${ENGINE_REPO} -o engine.zip`, { stdio: 'inherit' });
        
        // Extract
        execSync('unzip -o engine.zip', { stdio: 'inherit' });
        
        // Move files (adjust folder name if different)
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
    console.log('💡 Make sure you have: curl, unzip installed');
    console.log('💡 Also check that the engine repo URL is correct');
    process.exit(1);
}