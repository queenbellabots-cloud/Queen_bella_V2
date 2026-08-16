cat > /home/container/plugins/poll.js << 'EOF'
/**
 * 👑 QUEEN BELLA MD - Create Poll
 * Create a poll in groups
 */

const settings = require('../settings');

const REACTIONS = ['📊', '📈', '📉', '📋', '🗳️', '🎯'];

module.exports = {
    name: 'poll',
    aliases: ['vote', 'survey'],
    category: 'fun',
    description: 'Create a poll in group',
    usage: '.poll question | option1 | option2 | ...',
    react: '📊',
    async execute(conn, mek, args, chatId, isOwner) {
        try {
            const sender = mek.key.participant || mek.key.remoteJid;
            
            if (!args.length) {
                await conn.sendMessage(chatId, {
                    react: { text: '❌', key: mek.key }
                });
                await conn.sendMessage(chatId, { 
                    text: `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   📊 CREATE POLL            ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

❌ *No poll data provided!*

📝 *Usage:*
.poll question | option1 | option2 | option3

📌 *Example:*
.poll Best programming language? | Python | JavaScript | Java

${settings.footer}`
                });
                return;
            }

            const randomReact = REACTIONS[Math.floor(Math.random() * REACTIONS.length)];
            await conn.sendMessage(chatId, {
                react: { text: randomReact, key: mek.key }
            });

            const text = args.join(' ');
            const parts = text.split('|').map(s => s.trim());
            
            if (parts.length < 3) {
                await conn.sendMessage(chatId, {
                    react: { text: '❌', key: mek.key }
                });
                await conn.sendMessage(chatId, { 
                    text: `❌ Need at least 2 options!\n\nExample: .poll question | option1 | option2`
                });
                return;
            }

            const question = parts[0];
            const options = parts.slice(1);

            if (options.length > 10) {
                await conn.sendMessage(chatId, {
                    react: { text: '❌', key: mek.key }
                });
                await conn.sendMessage(chatId, { 
                    text: `❌ Maximum 10 options allowed!`
                });
                return;
            }

            await conn.sendPoll(chatId, question, options, {
                contextInfo: {
                    mentionedJid: [sender],
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
            console.error('Error in poll command:', error);
            await conn.sendMessage(chatId, { 
                text: `❌ Error creating poll: ${error.message}`
            });
        }
    }
};
EOF