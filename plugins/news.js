/**
 * 👑 QUEEN BELLA MD - Live News
 * Get latest news headlines
 */

const settings = require('../settings');
const axios = require('axios');

module.exports = {
    name: 'news',
    aliases: ['headlines', 'breaking'],
    category: 'tools',
    description: 'Get latest news',
    usage: '.news [category]',
    react: '📰',
    async execute(conn, mek, args, chatId, isOwner) {
        try {
            const sender = mek.key.participant || mek.key.remoteJid;

            await conn.sendMessage(chatId, {
                react: { text: '📰', key: mek.key }
            });

            // Use free news API
            const response = await axios.get('https://saurav.tech/NewsAPI/top-headlines/category/general/us.json', { timeout: 15000 });

            const articles = response.data.articles.slice(0, 5);
            let newsText = `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   📰 LATEST NEWS             ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

`;

            articles.forEach((article, i) => {
                newsText += `${i + 1}. *${article.title}*\n`;
                newsText += `   📍 ${article.source.name}\n`;
                newsText += `   🔗 ${article.url}\n\n`;
            });

            newsText += `\n${settings.footer}`;

            await conn.sendMessage(chatId, {
                text: newsText,
                contextInfo: { mentionedJid: [sender] }
            });

        } catch (error) {
            console.error('News error:', error);
            await conn.sendMessage(chatId, { text: '❌ Failed to fetch news.' });
        }
    }
};