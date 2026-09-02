cat > /home/container/index.js << 'EOF'
/**
 * 👑 QUEEN BELLA MD - Entry Point
 * This runs deploy.js which downloads the engine
 */

console.log('🔄 QUEEN BELLA MD - Loading...');
require('./deploy.js');
EOF