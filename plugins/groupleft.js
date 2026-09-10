/**
 * 👑 QUEEN BELLA MD - Leave Group Command
 * Makes the bot leave the group
 */

const settings = require('../settings');
const { isBotAdmin } = require('./checkadmin');

// Different reaction emojis
const LEAVE_REACTIONS = ['🚪', '🚶', '👋', '🏃', '💨', '🚀', '🔚', '⌛'];

module.exports = {
    name: 'left',
    aliases: ['leave', 'exit', 'bye', 'goodbye'],
    category: 'group',
    description: 'Make the bot leave the group',
    usage: '.left',
    react: '🚪',
    async execute(conn, mek, args, chatId, isOwner) {
        try {
            // 👇 REACT WITH RANDOM EMOJI
            const randomReact = LEAVE_REACTIONS[Math.floor(Math.random() * LEAVE_REACTIONS.length)];
            await conn.sendMessage(chatId, {
                react: { text: randomReact, key: mek.key }
            });

            // Only owner can use this command
            if (!isOwner) {
                await conn.sendMessage(chatId, {
                    text: '⚠️ *Access Denied.* Only my Owner can use this command.'
                });
                return;
            }

            // Check if in a group
            const isGroup = chatId.endsWith('@g.us');
            if (!isGroup) {
                await conn.sendMessage(chatId, {
                    text: '❌ This command can only be used in groups.'
                });
                return;
            }

            // ✅ Check if bot is admin (optional - not required to leave)
            // But we can check and notify if bot is admin before leaving
            try {
                const botAdmin = await isBotAdmin(conn, chatId);
                if (botAdmin) {
                    console.log('Bot is admin, leaving group...');
                }
            } catch (e) {
                // Ignore admin check errors
            }

            // Get group name
            let groupName = 'this group';
            try {
                const groupMetadata = await conn.groupMetadata(chatId);
                groupName = groupMetadata.subject || 'this group';
            } catch (e) {
                // Ignore
            }

            // Send leaving message
            await conn.sendMessage(chatId, {
                text: `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   👑 QUEEN BELLA MD V1   ┃
┃   Created by Dev RODGERS  ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

👋 *LEAVING GROUP*

📌 *Group:* ${groupName}
👤 *Requested By:* ${mek.pushName || 'Owner'}

✔️ Leaving group as requested.

${settings.footer}`
            });

            // Wait a moment before leaving
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Leave the group
            await conn.groupLeave(chatId);

            // Note: After this point, the bot is no longer in the group
            // so we can't send any more messages

        } catch (error) {
            console.error('Error in leave command:', error);
            // Try to send error message if still in group
            try {
                await conn.sendMessage(chatId, {
                    text: `❌ Error occurred: ${error.message || 'Failed to leave group.'}`
                });
            } catch (e) {
                // Bot might already be out of the group
                console.log('Could not send error message, bot may have already left.');
            }
        }
    }
};