/**
 * 👑 QUEEN BELLA MD - Unlock Group Command
 * Unlocks the group so everyone can send messages
 */

const settings = require('../settings');

// Different reaction emojis
const UNLOCK_REACTIONS = ['🔓', '🔑', '🆓', '✨', '🔓', '🚪', '🌟', '💫'];

module.exports = {
    name: 'unlockgc',
    aliases: ['unlock', 'unlockgroup', 'group unlock'],
    category: 'group',
    description: 'Unlock group (everyone can send messages)',
    usage: '.unlockgc',
    react: '🔓',
    async execute(conn, mek, args, chatId, isOwner) {
        try {
            // 👇 REACT WITH RANDOM EMOJI
            const randomReact = UNLOCK_REACTIONS[Math.floor(Math.random() * UNLOCK_REACTIONS.length)];
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

            // Check if bot is admin
            try {
                const groupMetadata = await conn.groupMetadata(chatId);
                const botJid = conn.user.id.split(':')[0] + '@s.whatsapp.net';
                const isBotAdmin = groupMetadata.participants.some(p => 
                    p.id === botJid && p.admin === 'admin'
                );

                if (!isBotAdmin) {
                    await conn.sendMessage(chatId, {
                        text: '❌ I need to be an admin to unlock the group.'
                    });
                    return;
                }
            } catch (e) {
                console.error('Group metadata error:', e);
            }

            // Get group name
            let groupName = 'this group';
            try {
                const groupMetadata = await conn.groupMetadata(chatId);
                groupName = groupMetadata.subject || 'this group';
            } catch (e) {}

            // Unlock the group
            await conn.groupSettingUpdate(chatId, 'not_announcement');

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

🔓 *GROUP UNLOCKED!*

📌 *Group:* ${groupName}
🔓 *Status:* UNLOCKED 🔓

📌 Everyone can now send messages.

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  📢 JOIN OUR CHANNEL         ┃
┃  👇 Click the button below    ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

${settings.footer}`
            });

        } catch (error) {
            console.error('Error in unlock command:', error);
            await conn.sendMessage(chatId, {
                react: { text: '❌', key: mek.key }
            });
            await conn.sendMessage(chatId, {
                text: '❌ Failed to unlock group. Make sure I am an admin.'
            });
        }
    }
};