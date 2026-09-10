/**
 * 👑 QUEEN BELLA MD - Download Bot Repository
 * Sends ZIP file, direct link, and GitHub repo link
 */

const settings = require('../settings');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'rodgers',
    aliases: ['repo', 'download', 'source'],
    category: 'main',
    description: 'Download the bot repository (ZIP + Links)',
    usage: '.rodgers',
    react: '📦',
    async execute(conn, mek, args, chatId, isOwner) {
        try {
            // 👇 REACT WITH DOWNLOAD EMOJI
            await conn.sendMessage(chatId, {
                react: { text: '📦', key: mek.key }
            });

            const repoUrl = 'https://github.com/queenbellabots-cloud/Queen_bella_V2';
            const downloadUrl = 'https://github.com/queenbellabots-cloud/Queen_bella_V2/archive/refs/heads/main.zip';
            const botNumber = settings.ownerNumber || '254716388654';

            // Step 1: Send the ZIP file
            await conn.sendMessage(chatId, {
                text: '📥 *Downloading repository...*\n\n⏳ Please wait...'
            });

            const zipPath = path.join(__dirname, '../temp_repo.zip');

            try {
                const response = await axios({
                    method: 'get',
                    url: downloadUrl,
                    responseType: 'stream',
                    timeout: 60000 // 60 seconds timeout
                });

                const writer = fs.createWriteStream(zipPath);
                response.data.pipe(writer);

                await new Promise((resolve, reject) => {
                    writer.on('finish', resolve);
                    writer.on('error', reject);
                });

                const stats = fs.statSync(zipPath);
                const fileSizeMB = (stats.size / (1024 * 1024)).toFixed(2);

                // Send the ZIP file
                await conn.sendMessage(chatId, {
                    document: fs.readFileSync(zipPath),
                    mimetype: 'application/zip',
                    fileName: `Queen_Bella_V2_${new Date().toISOString().slice(0,10)}.zip`,
                    caption: `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   👑 QUEEN BELLA MD V1   ┃
┃   Created by Dev RODGERS  ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

📦 *REPOSITORY DOWNLOADED!*

📌 *File:* Queen_Bella_V2.zip
📊 *Size:* ${fileSizeMB} MB
📅 *Date:* ${new Date().toLocaleDateString()}

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  📢 JOIN OUR CHANNEL         ┃
┃  👇 Click the button below    ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

${settings.footer}`
                });

                // Delete temp file
                fs.unlinkSync(zipPath);

            } catch (downloadError) {
                console.error('Download error:', downloadError);
                await conn.sendMessage(chatId, {
                    text: '⚠️ *Could not send ZIP file.*\n\nSending download links instead...'
                });
            }

            // Step 2: Send the links (always send these)
            const linkMessage = `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   👑 QUEEN BELLA MD V1   ┃
┃   Created by Dev RODGERS  ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

🔗 *REPOSITORY LINKS*

📌 *GitHub Repository:*
${repoUrl}

📥 *Direct Download ZIP:*
${downloadUrl}

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  📋 DEPLOYMENT STEPS          ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

1️⃣ Download the ZIP file (above or from link)
2️⃣ Go to https://control.katabump.com/
3️⃣ Create a new server
4️⃣ Upload and extract the ZIP
5️⃣ Edit settings.js with your details
6️⃣ Run: npm install
7️⃣ Run: npm start

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  📱 BOT NUMBER                ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
${botNumber}

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  📢 JOIN OUR CHANNEL         ┃
┃  👇 Click the button below    ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

${settings.footer}`;

            await conn.sendMessage(chatId, {
                text: linkMessage,
                contextInfo: {
                    forwardingScore: 999,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: settings.channelId,
                        newsletterName: settings.channelName,
                        serverMessageId: 1
                    }
                }
            });

            // 👇 REACT WITH SUCCESS
            await conn.sendMessage(chatId, {
                react: { text: '✅', key: mek.key }
            });

        } catch (error) {
            console.error('Error in rodgers:', error);
            await conn.sendMessage(chatId, {
                react: { text: '❌', key: mek.key }
            });
            await conn.sendMessage(chatId, {
                text: `❌ Error getting repository. Please try again later.`
            });
        }
    }
};