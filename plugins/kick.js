/**
 * 👑 QUEEN BELLA MD - Kick Command
 * Remove member from group (Admin only)
 */

const settings = require('../settings');

const REACTIONS = ['👢', '💥', '⚡', '🔥', '💫'];

module.exports = {
    name: 'kick',
    aliases: ['remove', 'boot', 'expel'],
    category: 'admin',
    description: 'Remove member from group',
    usage: '.kick @mention or .kick number',
    react: '👢',
    async execute(conn, mek, args, chatId, isOwner) {
        try {
            const sender = mek.key.participant || mek.key.remoteJid;
            
            if (!chatId.endsWith('@g.us')) {
                await conn.sendMessage(chatId, {
                    react: { text: '❌', key: mek.key }
                });
                await conn.sendMessage(chatId, { 
                    text: `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   👢 KICK COMMAND             ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

❌ *This command only works in groups!*

${settings.footer}`
                });
                return;
            }

            const groupMetadata = await conn.groupMetadata(chatId);
            const isAdmin = groupMetadata.participants.find(p => 
                p.id === sender && p.admin !== null
            );

            if (!isAdmin && !isOwner) {
                await conn.sendMessage(chatId, {
                    react: { text: '⛔', key: mek.key }
                });
                await conn.sendMessage(chatId, { 
                    text: `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   👢 KICK COMMAND             ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

⛔ *Only admins can kick members!*

${settings.footer}`
                });
                return;
            }

            let target;

            if (mek.message.extendedTextMessage && mek.message.extendedTextMessage.contextInfo) {
                const quoted = mek.message.extendedTextMessage.contextInfo;
                if (quoted.participant) {
                    target = quoted.participant;
                }
            }

            if (!target) {
                const mentioned = mek.message.extendedTextMessage?.contextInfo?.mentionedJid || [];
                if (mentioned.length > 0) {
                    target = mentioned[0];
                }
            }

            if (!target && args.length > 0) {
                const number = args[0].replace(/[^0-9]/g, '');
                target = number + '@s.whatsapp.net';
            }

            if (!target) {
                await conn.sendMessage(chatId, {
                    react: { text: '❌', key: mek.key }
                });
                await conn.sendMessage(chatId, { 
                    text: `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   👢 KICK COMMAND             ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

❌ *No target specified!*

📝 *How to use:*
• Reply to the person's message: .kick
• Mention them: .kick @user
• Use their number: .kick 2547xxxxxxxx

${settings.footer}`
                });
                return;
            }

            const targetIsAdmin = groupMetadata.participants.find(p => 
                p.id === target && p.admin !== null
            );

            if (targetIsAdmin) {
                await conn.sendMessage(chatId, {
                    react: { text: '⛔', key: mek.key }
                });
                await conn.sendMessage(chatId, { 
                    text: `❌ Cannot kick an admin!`
                });
                return;
            }

            const randomReact = REACTIONS[Math.floor(Math.random() * REACTIONS.length)];
            await conn.sendMessage(chatId, {
                react: { text: randomReact, key: mek.key }
            });

            await conn.groupParticipantsUpdate(chatId, [target], 'remove');

            const name = groupMetadata.participants.find(p => p.id === target)?.name || 'Unknown';

            await conn.sendMessage(chatId, {
                text: `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   👢 MEMBER KICKED            ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

✅ *${name}* has been removed from the group!

👤 *Kicked by:* @${sender.split('@')[0]}
📱 *Target:* ${target.split('@')[0]}

${settings.footer}`,
                contextInfo: {
                    mentionedJid: [sender, target]
                }
            });

        } catch (error) {
            console.error('Error in kick command:', error);
            await conn.sendMessage(chatId, { 
                text: `❌ Error kicking member: ${error.message}`
            });
        }
    }
};