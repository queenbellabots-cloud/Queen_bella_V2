/**
 * 👑 QUEEN BELLA MD - URL Shortener
 * Shorten long URLs using is.gd (FREE, NO API KEY)
 */

const settings = require('../settings');
const axios = require('axios');

module.exports = {
    name: 'shorten',
    aliases: ['short', 'urlshort'],
    category: 'tools',
    description: 'Shorten a URL',
    usage: '.shorten <url>',
    react: '🔗',
    async execute(conn, mek, args, chatId, isOwner) {
        try {
            const sender = mek.key.participant || mek.key.remoteJid;
            
            if (!args.length) {
                await conn.sendMessage(chatId, {
                    react: { text: '❌', key: mek.key }
                });
                await conn.sendMessage(chatId, { 
                    text: `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   🔗 URL SHORTENER          ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

❌ *No URL provided!*

📝 *Usage:*
.shorten <url>

📌 *Example:*
.shorten https://example.com/very/long/url

${settings.footer}`
                });
                return;
            }

            const url = args[0];
            
            // Validate URL
            try {
                new URL(url);
            } catch (e) {
                await conn.sendMessage(chatId, {
                    react: { text: '❌', key: mek.key }
                });
                await conn.sendMessage(chatId, { 
                    text: '❌ Invalid URL! Please provide a valid URL.'
                });
                return;
            }

            await conn.sendMessage(chatId, {
                react: { text: '⏳', key: mek.key }
            });

            // Use is.gd API (free, no key needed)
            const response = await axios.get(`https://is.gd/create.php?format=json&url=${encodeURIComponent(url)}`);
            
            if (response.data && response.data.shorturl) {
                const shortUrl = response.data.shorturl;
                
                const message = `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   🔗 SHORTENED URL          ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

🔗 *Original:*
${url}

✂️ *Shortened:*
${shortUrl}

${settings.footer}`;

                await conn.sendMessage(chatId, {
                    react: { text: '✅', key: mek.key }
                });
                await conn.sendMessage(chatId, {
                    text: message,
                    contextInfo: {
                        mentionedJid: [sender]
                    }
                });
            } else {
                throw new Error('Could not shorten URL');
            }

        } catch (error) {
            console.error('Error in shorten:', error);
            await conn.sendMessage(chatId, { 
                text: '❌ Error shortening URL. Please try again.'
            });
        }
    }
};