const moment = require('moment-timezone');
const settings = require('../settings');

module.exports = {
    name: 'info',
    aliases: ['botinfo', 'stats'],
    category: 'main',
    description: 'Show bot information',
    usage: '.info',
    async execute(conn, mek, args, chatId, isOwner) {
        const uptime = process.uptime();
        const hours = Math.floor(uptime / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        const seconds = Math.floor(uptime % 60);
        const commands = global.commands?.size || 0;
        const memory = process.memoryUsage();
        const usedMemory = (memory.rss / 1024 / 1024).toFixed(2);

        await conn.sendMessage(chatId, {
            text: `🤖 *QUEEN BELLA MD INFO*\n\n` +
                  `📌 *Name:* ${settings.botName}\n` +
                  `📌 *Version:* 1.0.0\n` +
                  `📌 *Owner:* ${settings.botOwner}\n` +
                  `📌 *Developer:* Dev RODGERS\n` +
                  `📌 *Prefix:* ${settings.prefix}\n` +
                  `📌 *Commands:* ${commands}\n` +
                  `📌 *Status:* Online ✅\n` +
                  `⏰ *Uptime:* ${hours}h ${minutes}m ${seconds}s\n` +
                  `💾 *Memory:* ${usedMemory} MB\n` +
                  `📅 *Date:* ${moment().tz('Africa/Nairobi').format('DD/MM/YYYY HH:mm:ss')}\n\n` +
                  `📢 *Channel:* ${settings.channelName}\n` +
                  `🔗 ${settings.channelLink}\n\n` +
                  `${settings.footer}`,
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