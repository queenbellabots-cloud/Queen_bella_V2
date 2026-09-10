const moment = require('moment-timezone');
const settings = require('../settings');

module.exports = {
    name: 'info',
    aliases: ['botinfo', 'stats'],
    category: 'main',
    description: 'Show bot information',
    usage: '.info',
    react: '🤖',
    async execute(conn, mek, args, chatId, isOwner) {
        const uptime = process.uptime();
        const hours = Math.floor(uptime / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        const seconds = Math.floor(uptime % 60);
        const commands = global.commands?.size || 0;
        const memory = process.memoryUsage();
        const usedMemory = (memory.rss / 1024 / 1024).toFixed(2);

        const response = `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   👑 QUEEN BELLA MD V1   ┃
┃   Created by Dev RODGERS  ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

📌 Name: ${settings.botName}
📌 Version: 1.0.0
📌 Owner: ${settings.botOwner}
📌 Developer: Dev RODGERS
📌 Prefix: ${settings.prefix}
📌 Commands: ${commands}
📌 Status: Online ✅
⏰ Uptime: ${hours}h ${minutes}m ${seconds}s
💾 Memory: ${usedMemory} MB
📅 Date: ${moment().tz('Africa/Nairobi').format('DD/MM/YYYY HH:mm:ss')}

📢 Channel: ${settings.channelName}
🔗 ${settings.channelLink}

${settings.footer}`;

        await conn.sendMessage(chatId, {
            text: response,
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
    }
};