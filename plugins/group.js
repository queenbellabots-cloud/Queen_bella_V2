/**
 * 👑 QUEEN BELLA MD - Group Info
 * Show group information
 */

const settings = require('../settings');

module.exports = {
    name: 'group',
    aliases: ['groupinfo', 'gc'],
    category: 'admin',
    description: 'Show group information',
    usage: '.group',
    react: '👥',
    async execute(conn, mek, args, chatId, isOwner) {
        try {
            const sender = mek.key.participant || mek.key.remoteJid;
            
            if (!chatId.endsWith('@g.us')) {
                await conn.sendMessage(chatId, {
                    react: { text: '❌', key: mek.key }
                });
                await conn.sendMessage(chatId, { 
                    text: '❌ This command only works in groups!'
                });
                return;
            }

            await conn.sendMessage(chatId, {
                react: { text: '👥', key: mek.key }
            });

            const groupMeta = await conn.groupMetadata(chatId);
            const participants = groupMeta.participants;
            const admins = participants.filter(p => p.admin !== null);
            const members = participants.filter(p => p.admin === null);

            const message = `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   👥 GROUP INFO              ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

📝 *Group:* ${groupMeta.subject}
👤 *Owner:* ${groupMeta.owner.split('@')[0]}
👥 *Members:* ${participants.length}
👑 *Admins:* ${admins.length}
👤 *Users:* ${members.length}

📅 *Created:* ${new Date(groupMeta.creation * 1000).toLocaleDateString()}

${settings.footer}`;

            await conn.sendMessage(chatId, {
                text: message,
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
            console.error('Error in group command:', error);
            await conn.sendMessage(chatId, { 
                text: '❌ Error getting group info.'
            });
        }
    }
};