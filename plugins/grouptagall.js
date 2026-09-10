/**
 * 👑 QUEEN BELLA MD - Tag All
 * Mention all group members
 */

const settings = require('../settings');

module.exports = {
    name: 'tagall',
    aliases: ['everyone', 'all'],
    category: 'admin',
    description: 'Mention all group members',
    usage: '.tagall [message]',
    react: '📢',
    async execute(conn, mek, args, chatId, isOwner) {
        try {
            if (!chatId.endsWith('@g.us')) {
                await conn.sendMessage(chatId, {
                    react: { text: '❌', key: mek.key }
                });
                await conn.sendMessage(chatId, { 
                    text: '❌ This command only works in groups!'
                });
                return;
            }

            const sender = mek.key.participant || mek.key.remoteJid;
            
            // Check if user is admin
            const groupMeta = await conn.groupMetadata(chatId);
            const isAdmin = groupMeta.participants.find(p => 
                p.id === sender && p.admin !== null
            );

            if (!isAdmin && !isOwner) {
                await conn.sendMessage(chatId, {
                    react: { text: '⛔', key: mek.key }
                });
                await conn.sendMessage(chatId, { 
                    text: '⛔ Only admins can use this command!'
                });
                return;
            }

            const participants = groupMeta.participants;
            const mentions = participants.map(p => p.id);
            const message = args.length ? args.join(' ') : '📢 Attention everyone!';

            await conn.sendMessage(chatId, {
                text: `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   📢 TAG ALL                ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

📝 *Message:* ${message}

👥 *Members:* ${participants.length}

${settings.footer}`,
                mentions: mentions
            });

        } catch (error) {
            console.error('Error in tagall:', error);
            await conn.sendMessage(chatId, { 
                text: '❌ Error tagging members.'
            });
        }
    }
};