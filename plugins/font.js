/**
 * 👑 QUEEN BELLA MD - Fancy Text Generator
 * Convert text to fancy fonts
 */

const settings = require('../settings');

const fonts = {
    bold: (t) => t.replace(/[a-zA-Z]/g, c => String.fromCodePoint(c.charCodeAt(0) + (c >= 'a' ? 119737 : 119743))),
    italic: (t) => t.replace(/[a-zA-Z]/g, c => String.fromCodePoint(c.charCodeAt(0) + (c >= 'a' ? 119789 : 119795))),
    boldItalic: (t) => t.replace(/[a-zA-Z]/g, c => String.fromCodePoint(c.charCodeAt(0) + (c >= 'a' ? 119841 : 119847)))
};

module.exports = {
    name: 'font',
    aliases: ['fancy', 'style'],
    category: 'tools',
    description: 'Convert text to fancy styles',
    usage: '.font <text>',
    react: '✨',
    async execute(conn, mek, args, chatId, isOwner) {
        try {
            const sender = mek.key.participant || mek.key.remoteJid;

            if (!args.length) {
                await conn.sendMessage(chatId, {
                    text: `✨ *Fancy Text*\n\nUsage: .font <text>\nExample: .font Hello World`
                });
                return;
            }

            const text = args.join(' ');
            await conn.sendMessage(chatId, {
                react: { text: '✨', key: mek.key }
            });

            const message = `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   ✨ FANCY TEXT STYLES       ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

📝 *Original:*
${text}

🔤 *Bold:*
${fonts.bold(text)}

🔤 *Italic:*
${fonts.italic(text)}

🔤 *Bold Italic:*
${fonts.boldItalic(text)}

${settings.footer}`;

            await conn.sendMessage(chatId, {
                text: message,
                contextInfo: { mentionedJid: [sender] }
            });

        } catch (error) {
            console.error('Font error:', error);
            await conn.sendMessage(chatId, { text: '❌ Failed to style text.' });
        }
    }
};