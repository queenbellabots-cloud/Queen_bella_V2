/**
 * 👑 QUEEN BELLA MD - Wikipedia Search
 * Search Wikipedia articles
 */

const settings = require('../settings');
const axios = require('axios');

module.exports = {
    name: 'wiki',
    aliases: ['wikipedia', 'search'],
    category: 'tools',
    description: 'Search Wikipedia',
    usage: '.wiki <topic>',
    react: '📚',
    async execute(conn, mek, args, chatId, isOwner) {
        try {
            const sender = mek.key.participant || mek.key.remoteJid;

            if (!args.length) {
                await conn.sendMessage(chatId, {
                    text: `📚 *Wikipedia Search*\n\nUsage: .wiki <topic>\nExample: .wiki Kenya`
                });
                return;
            }

            const query = args.join(' ');
            await conn.sendMessage(chatId, {
                react: { text: '📚', key: mek.key }
            });

            const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`;
            const response = await axios.get(url, { timeout: 15000 });

            if (!response.data || !response.data.extract) {
                await conn.sendMessage(chatId, {
                    text: `❌ No results found for "${query}"`
                });
                return;
            }

            const { title, extract, thumbnail } = response.data;
            let text = extract;

            // Truncate if too long
            if (text.length > 1500) {
                text = text.substring(0, 1500) + '...';
            }

            const caption = `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   📚 WIKIPEDIA RESULT        ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

📖 *${title}*

${text}

🔗 *Source:* en.wikipedia.org

${settings.footer}`;

            if (thumbnail && thumbnail.source) {
                await conn.sendMessage(chatId, {
                    image: { url: thumbnail.source },
                    caption: caption,
                    contextInfo: { mentionedJid: [sender] }
                });
            } else {
                await conn.sendMessage(chatId, {
                    text: caption,
                    contextInfo: { mentionedJid: [sender] }
                });
            }

        } catch (error) {
            console.error('Wiki error:', error);
            await conn.sendMessage(chatId, { text: `❌ No article found.` });
        }
    }
};