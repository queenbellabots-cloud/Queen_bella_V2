/**
 * 👑 QUEEN BELLA MD - Support
 */

const settings = require('../settings');

module.exports = {
    name: 'support',
    aliases: ['contact', 'helpdesk'],
    category: 'help',
    description: 'Contact support',
    usage: '.support',
    react: '🆘',
    async execute(conn, mek, args, chatId, isOwner) {
        try {
            await conn.sendMessage(chatId, {
                react: { text: '🆘', key: mek.key }
            });

            const support = `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   👑 QUEEN BELLA MD V1   ┃
┃   Created by Dev RODGERS  ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

🆘 *SUPPORT & CONTACT*

📌 *Developer:* ${settings.authorName || 'Dev RODGERS'}
📱 *WhatsApp:* ${settings.ownerNumber || '254755660053'}
📢 *Channel:* ${settings.channelName || 'QUEEN BELLA MD'}
🔗 *Channel Link:* ${settings.channelLink || 'https://whatsapp.com/channel/0029VbCwZHACXC3PNHgtMT31'}

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  📋 HOW TO GET HELP           ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
1️⃣ Join our WhatsApp channel for updates
2️⃣ Contact the developer directly
3️⃣ Check the FAQ using .faq
4️⃣ Report bugs to the developer

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  📢 JOIN OUR CHANNEL         ┃
┃  👇 Click the button below    ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

${settings.footer}`;

            await conn.sendMessage(chatId, {
                text: support,
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
            console.error('Error in support:', error);
            await conn.sendMessage(chatId, {
                text: '❌ Error loading support info.'
            });
        }
    }
};