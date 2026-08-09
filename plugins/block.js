/**
 * 👑 QUEEN BELLA MD - Block Command
 * Blocks a user in WhatsApp
 * ✅ EVERYONE CAN USE
 */

const settings = require('../settings');

module.exports = {
    name: 'block',
    aliases: ['blockuser', 'ban'],
    category: 'tools',
    description: 'Block a user in WhatsApp',
    usage: '.block @user or reply to message',
    react: '🔒',
    async execute(conn, mek, args, chatId, isOwner) {
        try {
            // 👇 REACT WITH LOCK EMOJI
            await conn.sendMessage(chatId, {
                react: { text: '🔒', key: mek.key }
            });

            let targetJid = null;
            let targetName = 'Unknown User';

            // Method 1: Check if replying to a message
            const quoted = mek.message?.extendedTextMessage?.contextInfo?.quotedMessage;
            if (quoted) {
                targetJid = mek.message.extendedTextMessage.contextInfo.participant || 
                           mek.message.extendedTextMessage.contextInfo.remoteJid;
            }

            // Method 2: Check if user is mentioned
            if (!targetJid && mek.message?.extendedTextMessage?.contextInfo?.mentionedJid) {
                targetJid = mek.message.extendedTextMessage.contextInfo.mentionedJid[0];
            }

            // Method 3: Check if number is provided in args
            if (!targetJid && args.length > 0) {
                let number = args[0].replace(/[^0-9]/g, '');
                if (number.startsWith('0')) number = '254' + number.slice(1);
                if (!number.startsWith('254')) number = '254' + number;
                targetJid = number + '@s.whatsapp.net';
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
            const senderJid = mek.key.participant || mek.key.remoteJid;
            if (targetJid === senderJid) {
                await conn.sendMessage(chatId, {
                    text: '🤦 You cannot block yourself!'
                });
                return;
            }

            // Check if trying to block the bot
            const botJid = conn.user.id.split(':')[0] + '@s.whatsapp.net';
            if (targetJid === botJid) {
                await conn.sendMessage(chatId, {
                    text: '🤖 You cannot block the bot!'
                });
                return;
            }

            // Get target name
            try {
                const contact = await conn.getName(targetJid);
                if (contact) targetName = contact;
            } catch (e) {}

            // ✅ BLOCK THE USER - FIXED
            try {
                await conn.updateBlockStatus(targetJid, 'block');
            } catch (blockError) {
                console.error('Block error:', blockError);
                // Try alternative method
                try {
                    await conn.sendMessage(targetJid, { text: 'You have been blocked.' });
                    await conn.updateBlockStatus(targetJid, 'block');
                } catch (e2) {
                    throw new Error('Could not block user');
                }
            }

            // 👇 REACT WITH SUCCESS
            await conn.sendMessage(chatId, {
                react: { text: '✅', key: mek.key }
            });

            await conn.sendMessage(chatId, {
                text: `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   👑 QUEEN BELLA MD V1   ┃
┃   Created by Dev RODGERS  ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

🔒 *USER BLOCKED!*

👤 *User:* ${targetName}
📱 *Number:* ${targetJid.split('@')[0]}
🟢 *Status:* BLOCKED ✅

They will no longer be able to message you.

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  🔓 To unblock: .unblock      ┃
┃  👇 Click the button below    ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

${settings.footer}`
            });

        } catch (error) {
            console.error('Error in block command:', error);
            await conn.sendMessage(chatId, {
                react: { text: '❌', key: mek.key }
            });
            
            let errorMsg = `❌ Error blocking user.\n\n`;
            errorMsg += `📌 *Possible reasons:*\n`;
            errorMsg += `• User is already blocked\n`;
            errorMsg += `• User is a contact\n`;
            errorMsg += `• User has privacy settings enabled\n\n`;
            errorMsg += `📌 *Try:*\n`;
            errorMsg += `• .block @username\n`;
            errorMsg += `• Reply to their message\n`;
            errorMsg += `• Use .unblock if already blocked\n\n`;
            errorMsg += `${settings.footer}`;
            
            await conn.sendMessage(chatId, { text: errorMsg });
        }
    }
};