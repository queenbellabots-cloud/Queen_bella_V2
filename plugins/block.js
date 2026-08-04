/**
 * 👑 QUEEN BELLA MD - Block Command
 * Block a user in WhatsApp
 */

const settings = require('../settings');

module.exports = {
    name: 'block',
    aliases: ['blockuser', 'ban'],
    category: 'tools',
    description: 'Block a user in WhatsApp',
    usage: '.block @user or .block reply to message',
    react: '🔒',
    async execute(conn, mek, args, chatId, isOwner) {
        try {
            // 👇 REACT WITH LOCK EMOJI
            await conn.sendMessage(chatId, {
                react: { text: '🔒', key: mek.key }
            });

            let targetJid = null;
            let targetName = 'Unknown User';

            // Check if replying to a message
            const quoted = mek.message?.extendedTextMessage?.contextInfo?.quotedMessage;
            if (quoted) {
                targetJid = mek.message.extendedTextMessage.contextInfo.participant || 
                           mek.message.extendedTextMessage.contextInfo.remoteJid;
                
                // Get sender name
                try {
                    const contact = await conn.getName(targetJid);
                    if (contact) targetName = contact;
                } catch (e) {}
            }

            // Check if user is mentioned
            if (!targetJid && mek.message?.extendedTextMessage?.contextInfo?.mentionedJid) {
                targetJid = mek.message.extendedTextMessage.contextInfo.mentionedJid[0];
                try {
                    const contact = await conn.getName(targetJid);
                    if (contact) targetName = contact;
                } catch (e) {}
            }

            // Check if number is provided in args
            if (!targetJid && args.length > 0) {
                let number = args[0].replace(/[^0-9]/g, '');
                if (number.startsWith('0')) number = '254' + number.slice(1);
                if (!number.startsWith('254')) number = '254' + number;
                targetJid = number + '@s.whatsapp.net';
                targetName = args[0];
            }

            // If still no target
            if (!targetJid) {
                await conn.sendMessage(chatId, {
                    text: `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   👑 QUEEN BELLA MD V1   ┃
┃   Created by Dev RODGERS  ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

🔒 *BLOCK COMMAND*

❌ *Usage:* 
• Reply to a user's message with .block
• Or type: .block @user
• Or type: .block 254XXXXXXXXX

${settings.footer}`
                });
                return;
            }

            // Check if trying to block self
            const botNumber = conn.user.id.split(':')[0] + '@s.whatsapp.net';
            if (targetJid === botNumber) {
                await conn.sendMessage(chatId, {
                    react: { text: '🤦', key: mek.key }
                });
                await conn.sendMessage(chatId, {
                    text: `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   👑 QUEEN BELLA MD V1   ┃
┃   Created by Dev RODGERS  ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

🤦 *Cannot block myself!*

I can't block myself. Please choose a different user.

${settings.footer}`
                });
                return;
            }

            // Block the user
            await conn.updateBlockStatus(targetJid, 'block');

            // 👇 REACT WITH SUCCESS EMOJI
            await conn.sendMessage(chatId, {
                react: { text: '✅', key: mek.key }
            });

            await conn.sendMessage(chatId, {
                text: `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   👑 QUEEN BELLA MD V1   ┃
┃   Created by Dev RODGERS  ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

🔒 *USER BLOCKED*

👤 *User:* ${targetName}
📱 *Number:* ${targetJid.split('@')[0]}
🟢 *Status:* BLOCKED ✅

They will no longer be able to message you.

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  🔓 To unblock: .unblock       ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

${settings.footer}`
            });

        } catch (error) {
            console.error('Error in block command:', error);
            // 👇 REACT WITH ERROR EMOJI
            await conn.sendMessage(chatId, {
                react: { text: '❌', key: mek.key }
            });
            await conn.sendMessage(chatId, {
                text: '❌ Error blocking user. Please try again.'
            });
        }
    }
};