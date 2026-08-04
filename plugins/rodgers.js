/**
 * 👑 QUEEN BELLA MD - Download Bot Repo
 * Downloads the bot repository as a ZIP file
 */

const settings = require('../settings');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'rodgers',
    aliases: ['repo', 'download', 'source'],
    category: 'main',
    description: 'Download the bot repository',
    usage: '.rodgers',
    react: '📦',
    async execute(conn, mek, args, chatId, isOwner) {
        try {
            // 👇 REACT WITH DOWNLOADING EMOJI FIRST
            await conn.sendMessage(chatId, {
                react: { text: '⬇️', key: mek.key }
            });

            // Send initial message
            await conn.sendMessage(chatId, { 
                text: '📦 *Downloading QUEEN BELLA MD Repository...*\n\n⏳ Please wait, this may take a few seconds...'
            });

            const repoUrl = 'https://github.com/queenbellabots-cloud/Queen_bella_V2/archive/refs/heads/main.zip';
            const zipPath = path.join(__dirname, '../temp_repo.zip');

            // Download the ZIP file
            const response = await axios({
                method: 'get',
                url: repoUrl,
                responseType: 'stream'
            });

            const writer = fs.createWriteStream(zipPath);
            response.data.pipe(writer);

            await new Promise((resolve, reject) => {
                writer.on('finish', resolve);
                writer.on('error', reject);
            });

            // Check file size
            const stats = fs.statSync(zipPath);
            const fileSizeMB = (stats.size / (1024 * 1024)).toFixed(2);

            // 👇 REACT WITH SUCCESS EMOJI
            await conn.sendMessage(chatId, {
                react: { text: '✅', key: mek.key }
            });

            // Send the file
            await conn.sendMessage(chatId, {
                document: fs.readFileSync(zipPath),
                mimetype: 'application/zip',
                fileName: `Queen_Bella_V2_${new Date().toISOString().slice(0,10)}.zip`,
                caption: `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   👑 QUEEN BELLA MD V1   ┃
┃   Created by Dev RODGERS  ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

✅ *Repository Downloaded!*

📦 *File:* Queen_Bella_V2.zip
📊 *Size:* ${fileSizeMB} MB
📅 *Date:* ${new Date().toLocaleDateString()}

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  📢 JOIN OUR CHANNEL         ┃
┃  👇 Click the button below    ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

© A BELLA BOTS PRODUCTIONS`,
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

            // Delete the temp file
            fs.unlinkSync(zipPath);

        } catch (error) {
            console.error('Error in rodgers command:', error);
            // 👇 REACT WITH ERROR EMOJI
            await conn.sendMessage(chatId, {
                react: { text: '❌', key: mek.key }
            });
            await conn.sendMessage(chatId, { 
                text: '❌ Error downloading repository. Please try again later.'
            });
        }
    }
};