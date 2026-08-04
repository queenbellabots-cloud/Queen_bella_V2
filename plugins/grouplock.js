/**
 * 👑 QUEEN BELLA MD - Lock Group Command
 * Locks the group so only admins can send messages
 */

const settings = require('../settings');
const { isBotAdmin } = require('./checkadmin');

// Different reaction emojis
const LOCK_REACTIONS = ['🔒', '🔐', '🛡️', '🚫', '⛔', '🔒', '🛑', '✋'];

module.exports = {
    name: 'lockgc',
    aliases: ['lock', 'lockgroup', 'group lock'],
    category: 'group',
    description: 'Lock group (admins only can send messages)',
    usage: '.lockgc',
    react: '🔒',
    async execute(conn, mek, args, chatId, isOwner) {
        try {
            // 👇 REACT WITH RANDOM EMOJI
            const randomReact = LOCK_REACTIONS[Math.floor(Math.random() * LOCK_REACTIONS.length)];
            await conn.sendMessage(chatId, {
                react: { text: randomReact, key: mek.key }
            });

            // Check if in a group
            const isGroup = chatId.endsWith('@g.us');
            if (!isGroup) {
                await conn.sendMessage(chatId, {
                    text: '❌ This command is for groups only.'
                });
                return;
            }

            // ✅ FIXED ADMIN CHECK - USING HELPER
            const botAdmin = await isBotAdmin(conn, chatId);
            if (!botAdmin) {
                await conn.sendMessage(chatId, {
                    text: '❌ I need to be an admin to lock the group.'
                });
                return;
            }

            // Get group name
            let groupName = 'this group';
            try {
                const groupMetadata = await conn.groupMetadata(chatId);
                groupName = groupMetadata.subject || 'this group';
            } catch (e) {}

            // Lock the group
            await conn.groupSettingUpdate(chatId, 'announcement');

            // 👇 REACT WITH SUCCESS
            await conn.sendMessage(chatId, {
                react: { text: '✅', key: mek.key }
            });

            // Send success message
            await conn.sendMessage(chatId, {
                text: `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   👑 QUEEN BELLA MD V1   ┃
┃   Created by Dev RODGERS  ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

🔒 *GROUP LOCKED!*

📌 *Group:* ${groupName}
🔐 *Status:* LOCKED 🔒

📌 Only admins can send messages now.

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  📢 JOIN OUR CHANNEL         ┃
┃  👇 Click the button below    ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

${settings.footer}`
            });

        } catch (error) {
            console.error('Error in lock command:', error);
            await conn.sendMessage(chatId, {
                react: { text: '❌', key: mek.key }
            });
            await conn.sendMessage(chatId, {
                text: '❌ Failed to lock group. Make sure I am an admin.'
            });
        }
    }
};