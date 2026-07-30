const settings = require('../settings');

module.exports = {
    name: 'owner',
    aliases: ['creator', 'dev'],
    category: 'main',
    description: 'Show bot owner info',
    usage: '.owner',
    react: '👑',
    async execute(conn, mek, args, chatId, isOwner) {
        try {
            const ownerText = `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   👑 QUEEN BELLA MD V1   ┃
┃   Created by Dev RODGERS  ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃      👨‍💻 OWNER INFO          ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

👤 Name: RODGERS ONYANGO
👨‍💻 Developer: Dev RODGERS
📱 Number: 254755660053
🩵 Status: Confused 🤔
📢 Channel: ${settings.channelName}

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  📢 JOIN OUR CHANNEL         ┃
┃  👇 Click the button below    ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

${settings.footer}`;

            await conn.sendMessage(chatId, {
                image: { url: settings.ownerImage },
                caption: ownerText,
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
        } catch (error) {
            console.error('Error in owner:', error);
            await conn.sendMessage(chatId, { text: '❌ Error loading owner info.' });
        }
    }
};