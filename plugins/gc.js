/**
 * 👑 QUEEN BELLA MD - Group Info
 * Show group information and stats
 */

const settings = require('../settings');

module.exports = {
    name: 'gc',
    aliases: ['group', 'groupinfo'],
    category: 'admin',
    description: 'Show group information',
    usage: '.gc',
    react: '👥',
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
            const groupMeta = await conn.groupMetadata(chatId);
            
            const participants = groupMeta.participants;
            const admins = participants.filter(p => p.admin !== null);
            const members = participants.filter(p => p.admin === null);
            const total = participants.length;

            // Get group icon
            let icon = '📁';
            try {
                const pp = await conn.profilePictureUrl(chatId, 'image');
                icon = pp;
            } catch (e) {}

            const message = `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   👥 GROUP INFORMATION       ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

📝 *Group:* ${groupMeta.subject}
👤 *Owner:* ${groupMeta.owner.split('@')[0]}
👥 *Total Members:* ${total}
👑 *Admins:* ${admins.length}
👤 *Members:* ${members.length}
📅 *Created:* ${new Date(groupMeta.creation * 1000).toLocaleDateString()}

🔒 *Privacy:* ${groupMeta.announce ? 'Announcement Only' : 'Open'}

${settings.footer}`;

            await conn.sendMessage(chatId, {
                text: message,
                contextInfo: {
                    mentionedJid: [sender]
                }
            });

        } catch (error) {
            console.error('Error in gc command:', error);
            await conn.sendMessage(chatId, { 
                text: '❌ Error getting group info.'
            });
        }
    }
};