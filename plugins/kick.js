cat > /home/container/plugins/kick.js << 'EOF'
/**
 * 👑 QUEEN BELLA MD - Kick Command
 * Remove member from group (Admin only)
 */

const settings = require('../settings');

module.exports = {
    name: 'kick',
    aliases: ['remove', 'boot', 'expel'],
    category: 'admin',
    description: 'Remove member from group',
    usage: '.kick @mention or .kick number',
    react: '👢',
    async execute(conn, mek, args, chatId, isOwner) {
        try {
            // Check if it's a group
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

            // Check if user is admin
            const groupMetadata = await conn.groupMetadata(chatId);
            const sender = mek.key.participant || mek.key.remoteJid;
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

            // Check if replying to a message
            if (mek.message.extendedTextMessage && mek.message.extendedTextMessage.contextInfo) {
                const quoted = mek.message.extendedTextMessage.contextInfo;
                if (quoted.participant) {
                    target = quoted.participant;
                }
            }

            // If not replying, check for mention or number
            if (!target) {
                const mentioned = mek.message.extendedTextMessage?.contextInfo?.mentionedJid || [];
                if (mentioned.length > 0) {
                    target = mentioned[0];
                }
            }

            // If still no target, check args for number
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

            // Check if target is admin
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

            await conn.sendMessage(chatId, {
                react: { text: '👢', key: mek.key }
            });

            // Kick the member
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
EOF