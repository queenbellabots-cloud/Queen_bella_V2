const settings = require('../settings');

module.exports = {
    name: 'owner',
    aliases: ['creator', 'dev'],
    category: 'main',
    description: 'Show bot owner info',
    usage: '.owner',
    async execute(conn, mek, args, chatId, isOwner) {
        await conn.sendMessage(chatId, {
            text: `👑 *QUEEN BELLA MD OWNER*\n\n` +
                  `👤 *Name:* ${settings.botOwner}\n` +
                  `👨‍💻 *Developer:* Dev RODGERS\n` +
                  `📱 *Number:* ${settings.ownerNumber}\n` +
                  `📢 *Channel:* ${settings.channelName}\n\n` +
                  `© MADE BY RODGERS`,
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