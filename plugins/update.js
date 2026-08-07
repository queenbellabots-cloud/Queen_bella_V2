/**
 * 👑 QUEEN BELLA MD - Auto Update Command
 * Updates the bot to the latest version and shows new features
 */

const settings = require('../settings');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const axios = require('axios');

module.exports = {
    name: 'update',
    aliases: ['upgrade', 'pull', 'sync'],
    category: 'owner',
    description: 'Update the bot to the latest version',
    usage: '.update',
    react: '🔄',
    async execute(conn, mek, args, chatId, isOwner) {
        try {
            await conn.sendMessage(chatId, {
                react: { text: '🔄', key: mek.key }
            });

            if (!isOwner) {
                await conn.sendMessage(chatId, {
                    text: '❌ Only the bot owner can update the bot.'
                });
                return;
            }

            await conn.sendMessage(chatId, {
                text: '🔄 *Checking for updates...*\n\n⏳ Fetching latest version info...'
            });

            // Get current version
            const currentPackage = require('../package.json');
            const currentVersion = currentPackage.version || '1.0.0';

            // Fetch latest repo info from GitHub
            const repoUrl = 'https://api.github.com/repos/queenbellabots-cloud/Queen_bella_V2/commits/main';
            
            let latestCommit = '';
            let newFeatures = [];
            let newCommands = [];

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

                // Check for new commands in the latest commit
                const filesChanged = response.data?.files || [];
                const newPluginFiles = filesChanged
                    .filter(f => f.filename?.startsWith('plugins/') && f.status === 'added')
                    .map(f => {
                        const name = path.basename(f.filename, '.js');
                        return name;
                    });

                if (newPluginFiles.length > 0) {
                    newCommands = newPluginFiles;
                }

            } catch (e) {
                console.log('Could not fetch commit info:', e.message);
            }

            // Check for new commands by scanning plugins folder (after update)
            const currentPlugins = fs.readdirSync(path.join(__dirname, '..', 'plugins'))
                .filter(f => f.endsWith('.js'))
                .map(f => path.basename(f, '.js'));

            // Build update message
            let updateMessage = `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   👑 QUEEN BELLA MD V1   ┃
┃   Created by Dev RODGERS  ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

🔄 *UPDATE AVAILABLE!*

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

            if (newCommands.length > 0) {
                updateMessage += `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  📋 NEW COMMANDS              ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛\n`;
                newCommands.forEach(cmd => {
                    updateMessage += `✅ .${cmd}\n`;
                });
                updateMessage += '\n';
            }

            if (newFeatures.length === 0 && newCommands.length === 0) {
                updateMessage += `📌 No new features or commands found.\n\n`;
            }

            updateMessage += `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  ⚡ UPDATE COMMANDS           ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
• .update now    — Start update
• .update info   — Check again

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

                // Extract
                const AdmZip = require('adm-zip');
                const zip = new AdmZip(zipPath);
                zip.extractAllTo(extractPath, true);

                const extractedFolders = fs.readdirSync(extractPath).filter(f => 
                    fs.statSync(path.join(extractPath, f)).isDirectory()
                );
                const sourceFolder = path.join(extractPath, extractedFolders[0]);

                // Copy files
                const filesToCopy = ['index.js', 'main.js', 'settings.js', 'package.json'];
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

                // Get new commands after update
                const newPlugins = fs.readdirSync(path.join(__dirname, '..', 'plugins'))
                    .filter(f => f.endsWith('.js'))
                    .map(f => path.basename(f, '.js'));

                const newCommandsList = newPlugins.filter(p => !currentPlugins.includes(p));

                let successMessage = `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   👑 QUEEN BELLA MD V1   ┃
┃   Created by Dev RODGERS  ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

✅ *UPDATE COMPLETED!*

📌 *New Version:* v${currentVersion}
📌 *Commit:* ${latestCommit}

`;

                if (newCommandsList.length > 0) {
                    successMessage += `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  📋 NEW COMMANDS ADDED      ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛\n`;
                    newCommandsList.forEach(cmd => {
                        successMessage += `✅ .${cmd}\n`;
                    });
                    successMessage += '\n';
                }

                successMessage += `🔄 Restarting the bot...\n\n${settings.footer}`;

                await conn.sendMessage(chatId, {
                    text: successMessage
                });

                await new Promise(resolve => setTimeout(resolve, 3000));
                process.exit(0);

            } else {
                // If just checking, show info
                await conn.sendMessage(chatId, {
                    text: `📌 *To update, type:* .update now`
                });
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