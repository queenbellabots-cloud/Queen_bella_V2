/**
 * 👑 QUEEN BELLA MD - Auto Update Command
 * Updates the bot to the latest version - PUBLIC
 */

const settings = require('../settings');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

// Check if adm-zip is installed, if not, install it
function ensureAdmZip() {
    try {
        require.resolve('adm-zip');
        return true;
    } catch (e) {
        return false;
    }
}

module.exports = {
    name: 'update',
    aliases: ['upgrade', 'pull', 'sync'],
    category: 'main',
    description: 'Update the bot to the latest version',
    usage: '.update',
    react: '🔄',
    async execute(conn, mek, args, chatId, isOwner) {
        try {
            // 👇 REACT WITH SPINNING EMOJI
            await conn.sendMessage(chatId, {
                react: { text: '🔄', key: mek.key }
            });

            // ✅ REMOVED OWNER CHECK - EVERYONE CAN UPDATE THEIR OWN BOT!

            // Check if adm-zip is installed
            if (!ensureAdmZip()) {
                await conn.sendMessage(chatId, {
                    text: '📦 *Installing required package...*\n\n⏳ Please wait...'
                });

                // Install adm-zip
                const installCmd = exec('npm install adm-zip --save', { 
                    cwd: path.join(__dirname, '..') 
                });

                await new Promise((resolve) => {
                    installCmd.on('close', (code) => {
                        resolve(code === 0);
                    });
                });

                // Check again
                if (!ensureAdmZip()) {
                    await conn.sendMessage(chatId, {
                        text: '❌ *Failed to install required package.*\n\nPlease run: npm install adm-zip'
                    });
                    return;
                }

                await conn.sendMessage(chatId, {
                    text: '✅ *Package installed successfully!*\n\n🔄 Please try .update again.'
                });
                return;
            }

            await conn.sendMessage(chatId, {
                text: '🔄 *Checking for updates...*\n\n⏳ Fetching latest version info...'
            });

            // Get current version
            let currentVersion = '1.0.0';
            try {
                const currentPackage = require('../package.json');
                currentVersion = currentPackage.version || '1.0.0';
            } catch (e) {}

            // Fetch latest repo info from GitHub
            const repoUrl = 'https://api.github.com/repos/queenbellabots-cloud/Queen_bella_V2/commits/main';
            
            let latestCommit = '';
            let newFeatures = [];

            try {
                const response = await axios.get(repoUrl, {
                    headers: { 'Accept': 'application/json' }
                });
                
                latestCommit = response.data?.sha?.substring(0, 7) || 'unknown';
                
                // Try to get commit message for features
                const commitMsg = response.data?.commit?.message || '';
                const features = commitMsg.match(/feat(?:ure)?:\s*(.+)/i);
                if (features) {
                    newFeatures.push(features[1]);
                }

            } catch (e) {
                console.log('Could not fetch commit info:', e.message);
            }

            // Build update message
            let updateMessage = `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   👑 QUEEN BELLA MD V1   ┃
┃   Created by Dev RODGERS  ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

🔄 *UPDATE CHECK*

📌 *Current Version:* v${currentVersion}
📌 *Latest Commit:* ${latestCommit}

`;

            if (newFeatures.length > 0) {
                updateMessage += `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  ✨ NEW FEATURES               ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛\n`;
                newFeatures.forEach(f => {
                    updateMessage += `✅ ${f}\n`;
                });
                updateMessage += '\n';
            }

            if (newFeatures.length === 0) {
                updateMessage += `📌 No new features found.\n\n`;
            }

            updateMessage += `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  ⚡ UPDATE COMMANDS           ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
• .update now    — Start update
• .update info   — Check again

📌 *Everyone can update their own bot!*

${settings.footer}`;

            await conn.sendMessage(chatId, {
                text: updateMessage
            });

            // If user types .update now, start the update
            if (args[0]?.toLowerCase() === 'now') {
                await conn.sendMessage(chatId, {
                    text: '🔄 *Starting update...*\n\n⏳ This may take a few moments...'
                });

                const tempDir = path.join(__dirname, '../temp_update');
                if (!fs.existsSync(tempDir)) {
                    fs.mkdirSync(tempDir, { recursive: true });
                }

                const zipPath = path.join(tempDir, 'repo.zip');
                const extractPath = path.join(tempDir, 'extracted');

                // Download latest repo
                const downloadUrl = 'https://github.com/queenbellabots-cloud/Queen_bella_V2/archive/refs/heads/main.zip';
                const response2 = await axios({
                    method: 'get',
                    url: downloadUrl,
                    responseType: 'arraybuffer'
                });

                fs.writeFileSync(zipPath, response2.data);

                // Extract using adm-zip
                const AdmZip = require('adm-zip');
                const zip = new AdmZip(zipPath);
                zip.extractAllTo(extractPath, true);

                const extractedFolders = fs.readdirSync(extractPath).filter(f => 
                    fs.statSync(path.join(extractPath, f)).isDirectory()
                );
                const sourceFolder = path.join(extractPath, extractedFolders[0]);

                // Copy files (skip settings.js to keep user's config)
                const filesToCopy = ['index.js', 'main.js', 'package.json'];
                const foldersToCopy = ['plugins', 'lib'];

                for (const file of filesToCopy) {
                    const srcPath = path.join(sourceFolder, file);
                    const destPath = path.join(__dirname, '../', file);
                    if (fs.existsSync(srcPath)) {
                        fs.copyFileSync(srcPath, destPath);
                    }
                }

                for (const folder of foldersToCopy) {
                    const srcPath = path.join(sourceFolder, folder);
                    const destPath = path.join(__dirname, '../', folder);
                    if (fs.existsSync(srcPath)) {
                        if (fs.existsSync(destPath)) {
                            fs.rmSync(destPath, { recursive: true, force: true });
                        }
                        fs.cpSync(srcPath, destPath, { recursive: true });
                    }
                }

                // Clean up
                fs.rmSync(tempDir, { recursive: true, force: true });

                let successMessage = `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   👑 QUEEN BELLA MD V1   ┃
┃   Created by Dev RODGERS  ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

✅ *UPDATE COMPLETED!*

📌 *New Version:* v${currentVersion}
📌 *Commit:* ${latestCommit}

${newFeatures.length > 0 ? '✨ New features added!\n' : ''}
🔄 Restarting the bot...

${settings.footer}`;

                await conn.sendMessage(chatId, {
                    text: successMessage
                });

                await new Promise(resolve => setTimeout(resolve, 3000));
                process.exit(0);

            }

        } catch (error) {
            console.error('Update error:', error);
            await conn.sendMessage(chatId, {
                react: { text: '❌', key: mek.key }
            });
            await conn.sendMessage(chatId, {
                text: `❌ *Update failed!*\n\nError: ${error.message}`
            });
        }
    }
};