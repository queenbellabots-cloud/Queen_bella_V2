/**
 * 👑 QUEEN BELLA MD - QR Code Generator
 * Generate QR codes from text/links
 */

const settings = require('../settings');

module.exports = {
    name: 'qr',
    aliases: ['qrcode', 'makeqr'],
    category: 'tools',
    description: 'Generate QR code',
    usage: '.qr <text or url>',
    react: '📱',
    async execute(conn, mek, args, chatId, isOwner) {
        try {
            const sender = mek.key.participant || mek.key.remoteJid;

            if (!args.length) {
                await conn.sendMessage(chatId, {
                    text: `📱 *QR Code Generator*\n\nUsage: .qr <text or url>\nExample: .qr https://github.com`
                });
                return;
            }

            const text = args.join(' ');
            await conn.sendMessage(chatId, {
                react: { text: '📱', key: mek.key }
            });

            // Use free QR API
            const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(text)}`;

            await conn.sendMessage(chatId, {
                image: { url: qrUrl },
                caption: `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   📱 QR CODE GENERATED      ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

📝 *Content:* ${text}

📌 *Scan with any QR scanner*

${settings.footer}`,
                contextInfo: {
                    mentionedJid: [sender]
                }
            });

        } catch (error) {
            console.error('QR error:', error);
            await conn.sendMessage(chatId, { text: '❌ Failed to generate QR code.' });
        }
    }
};