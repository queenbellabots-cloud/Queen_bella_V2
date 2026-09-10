/**
 * 👑 QUEEN BELLA MD - Website Screenshot
 * Take screenshot of any website
 */

const settings = require('../settings');

module.exports = {
    name: 'ss',
    aliases: ['screenshot', 'webshot'],
    category: 'tools',
    description: 'Screenshot a website',
    usage: '.ss <url>',
    react: '📸',
    async execute(conn, mek, args, chatId, isOwner) {
        try {
            const sender = mek.key.participant || mek.key.remoteJid;

            if (!args.length) {
                await conn.sendMessage(chatId, {
                    text: `📸 *Website Screenshot*\n\nUsage: .ss <url>\nExample: .ss https://github.com`
                });
                return;
            }

            let url = args[0];
            if (!url.startsWith('http')) url = 'https://' + url;

            await conn.sendMessage(chatId, {
                react: { text: '📸', key: mek.key }
            });

            await conn.sendMessage(chatId, {
                text: `📸 *Taking screenshot...*\n\n🔗 ${url}`
            });

            // Use free screenshot API
            const screenshotUrl = `https://api.microlink.io/?url=${encodeURIComponent(url)}&screenshot=true&meta=false&embed=screenshot.url`;

            await conn.sendMessage(chatId, {
                image: { url: screenshotUrl },
                caption: `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   📸 WEBSITE SCREENSHOT      ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

🔗 *URL:* ${url}
📱 *Captured:* ${new Date().toLocaleString()}

${settings.footer}`,
                contextInfo: { mentionedJid: [sender] }
            });

        } catch (error) {
            console.error('Screenshot error:', error);
            await conn.sendMessage(chatId, { text: '❌ Failed to capture screenshot.' });
        }
    }
};