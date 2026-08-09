/**
 * 👑 QUEEN BELLA MD - Unblock Command
 * Unblocks a user in WhatsApp
 * ✅ EVERYONE CAN USE
 */

const settings = require('../settings');

module.exports = {
    name: 'unblock',
    aliases: ['unban', 'unblockuser'],
    category: 'tools',
    description: 'Unblock a user in WhatsApp',
    usage: '.unblock @user or reply to message',
    react: '🔓',
    async execute(conn, mek, args, chatId, isOwner) {
        try {
            await conn.sendMessage(chatId, {
                react: { text: '🔓', key: mek.key }
            });

            let targetJid = null;
            let targetName = 'Unknown User';

            const quoted = mek.message?.extendedTextMessage?.contextInfo?.quotedMessage;
            if (quoted) {
                targetJid = mek.message.extendedTextMessage.contextInfo.participant || 
                           mek.message.extendedTextMessage.contextInfo.remoteJid;
            }

            if (!targetJid && mek.message?.extendedTextMessage?.contextInfo?.mentionedJid) {
                targetJid = mek.message.extendedTextMessage.contextInfo.mentionedJid[0];
            }

            if (!targetJid && args.length > 0) {
                let number = args[0].replace(/[^0-9]/g, '');
                if (number.startsWith('0')) number = '254' + number.slice(1);
                if (!number.startsWith('254')) number = '254' + number;
                targetJid = number + '@s.whatsapp.net';
            }

            if (!targetJid) {
                await conn.sendMessage(chatId, {
                    text: `🔓 *UNBLOCK COMMAND*

❌ *Usage:* 
• Reply to a user's message with .unblock
• Or type: .unblock @user
• Or type: .unblock 254XXXXXXXXX`
                });
                return;
            }

            // Get target name
            try {
                const contact = await conn.getName(targetJid);
                if (contact) targetName = contact;
            } catch (e) {}

            // ✅ UNBLOCK THE USER - FIXED
            await conn.updateBlockStatus(targetJid, 'unblock');

            await conn.sendMessage(chatId, {
                react: { text: '✅', key: mek.key }
            });

            await conn.sendMessage(chatId, {
                text: `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   👑 QUEEN BELLA MD V1   ┃
┃   Created by Dev RODGERS  ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

🔓 *USER UNBLOCKED!*

👤 *User:* ${targetName}
📱 *Number:* ${targetJid.split('@')[0]}
🟢 *Status:* UNBLOCKED ✅

They can now message you again.

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  🔒 To block: .block          ┃
┃  👇 Click the button below    ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

${settings.footer}`
            });

        } catch (error) {
            console.error('Error in unblock:', error);
            await conn.sendMessage(chatId, {
                react: { text: '❌', key: mek.key }
            });
            await conn.sendMessage(chatId, {
                text: `❌ Error unblocking user. Please make sure the user is blocked.\n\n${settings.footer}`
            });
        }
    }
};