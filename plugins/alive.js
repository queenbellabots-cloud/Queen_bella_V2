const settings = require('../settings');

module.exports = {
    name: 'alive',
    aliases: ['status', 'check'],
    category: 'main',
    description: 'Check if bot is alive',
    usage: '.alive',
    react: '💚',
    async execute(conn, mek, args, chatId, isOwner) {
        const uptime = process.uptime();
        const hours = Math.floor(uptime / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        const seconds = Math.floor(uptime % 60);
        const commands = global.commands?.size || 0;
        
        const response = `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   👑 QUEEN BELLA MD V1   ┃
┃   Created by Dev RODGERS  ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

✅ Status: Online
⏰ Uptime: ${hours}h ${minutes}m ${seconds}s
⚡ Prefix: ${settings.prefix}
📊 Commands: ${commands}

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