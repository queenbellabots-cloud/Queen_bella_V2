cat > /home/container/plugins/meme.js << 'EOF'
/**
 * 👑 QUEEN BELLA MD - Random Meme
 * Get a random meme
 */

const settings = require('../settings');

module.exports = {
    name: 'meme',
    aliases: ['funny', 'lol', 'haha'],
    category: 'fun',
    description: 'Get a random meme',
    usage: '.meme',
    react: '😂',
    async execute(conn, mek, args, chatId, isOwner) {
        try {
            await conn.sendMessage(chatId, {
                react: { text: '😂', key: mek.key }
            });

            const memes = [
                'https://i.imgflip.com/1bij.jpg',
                'https://i.imgflip.com/26am.jpg',
                'https://i.imgflip.com/2fm6x.jpg',
                'https://i.imgflip.com/4t0m5.jpg',
                'https://i.imgflip.com/5iwwp.jpg',
                'https://i.imgflip.com/6i5m.jpg',
                'https://i.imgflip.com/7i5m.jpg',
                'https://i.imgflip.com/8i5m.jpg'
            ];

            const random = memes[Math.floor(Math.random() * memes.length)];

            await conn.sendMessage(chatId, {
                image: { url: random },
                caption: `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   😂 RANDOM MEME             ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

🎭 *Here's your daily dose of laughter!*

📢 *Share with friends!*

${settings.footer}`,
                contextInfo: {
                    mentionedJid: [mek.key.participant || mek.key.remoteJid],
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
            console.error('Error in meme command:', error);
            await conn.sendMessage(chatId, { 
                text: '❌ Error loading meme.'
            });
        }
    }
};
EOF