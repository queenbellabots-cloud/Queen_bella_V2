/**
 * 👑 QUEEN BELLA MD - Repository
 * Show bot GitHub repo
 */

const settings = require('../settings');

module.exports = {
    name: 'repo',
    aliases: ['github', 'source'],
    category: 'main',
    description: 'Get bot repository link',
    usage: '.repo',
    react: '📂',
    async execute(conn, mek, args, chatId, isOwner) {
        try {
            const sender = mek.key.participant || mek.key.remoteJid;
            
            await conn.sendMessage(chatId, {
                react: { text: '📂', key: mek.key }
            });

            const message = `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   📂 QUEEN BELLA MD V1   ┃
┃   Created by Dev RODGERS  ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

📂 *Repository*
🔗 https://github.com/rodgers254/QUEEN-BELLA-MD-V1

⭐ *Star this repo!*
🔀 *Fork it!*

${settings.footer}`;

            await conn.sendMessage(chatId, {
                text: message,
                contextInfo: {
                    mentionedJid: [sender],
                    forwardingScore: 999,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: settings.channelId,
                        newsletterName: settings.channelName,
                        serverMessageId: 1
                    }
                }
            });

        } catch (error) {
            console.error('Error in repo command:', error);
            await conn.sendMessage(chatId, { 
                text: '❌ Error getting repo info.'
            });
        }
    }
};