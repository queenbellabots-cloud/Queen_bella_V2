/**
 * 👑 QUEEN BELLA MD - GitHub Info
 * Get info about GitHub users/repos
 */

const settings = require('../settings');
const axios = require('axios');

module.exports = {
    name: 'git',
    aliases: ['github', 'gh'],
    category: 'tools',
    description: 'Get GitHub user info',
    usage: '.git <username>',
    react: '💻',
    async execute(conn, mek, args, chatId, isOwner) {
        try {
            const sender = mek.key.participant || mek.key.remoteJid;

            if (!args.length) {
                await conn.sendMessage(chatId, {
                    text: `💻 *GitHub Info*\n\nUsage: .git <username>\nExample: .git torvalds`
                });
                return;
            }

            const username = args[0];
            await conn.sendMessage(chatId, {
                react: { text: '💻', key: mek.key }
            });

            const response = await axios.get(`https://api.github.com/users/${username}`, { timeout: 15000 });
            const user = response.data;

            const caption = `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   💻 GITHUB PROFILE          ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

👤 *Name:* ${user.name || user.login}
📝 *Bio:* ${user.bio || 'N/A'}
📍 *Location:* ${user.location || 'N/A'}
🏢 *Company:* ${user.company || 'N/A'}

📊 *Stats:*
📦 Repos: ${user.public_repos}
👥 Followers: ${user.followers}
👤 Following: ${user.following}

🔗 *Profile:* ${user.html_url}
📅 *Joined:* ${new Date(user.created_at).toLocaleDateString()}

${settings.footer}`;

            await conn.sendMessage(chatId, {
                image: { url: user.avatar_url },
                caption: caption,
                contextInfo: { mentionedJid: [sender] }
            });

        } catch (error) {
            console.error('GitHub error:', error);
            await conn.sendMessage(chatId, { text: '❌ GitHub user not found.' });
        }
    }
};