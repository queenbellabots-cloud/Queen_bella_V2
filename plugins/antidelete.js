/**
 * 👑 QUEEN BELLA MD - Anti Delete Command
 * Detects and recovers deleted messages
 */

const settings = require('../settings');

// Global toggle for anti-delete
if (global.antiDelete === undefined) {
    global.antiDelete = true; // Default: ON
}

module.exports = {
    name: 'antidelete',
    aliases: ['nodelete', 'atd'],
    category: 'tools',
    description: 'Toggle Anti Delete - Recover deleted messages',
    usage: '.antidelete on/off',
    react: '🗑️',
    async execute(conn, mek, args, chatId, isOwner) {
        try {
            // 👇 REACT WITH TRASH EMOJI
            await conn.sendMessage(chatId, {
                react: { text: '🗑️', key: mek.key }
            });

            const action = args[0]?.toLowerCase();

            if (action === 'on') {
                global.antiDelete = true;
                await conn.sendMessage(chatId, {
                    text: `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   👑 QUEEN BELLA MD V1   ┃
┃   Created by Dev RODGERS  ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

🗑️ *ANTI DELETE: ENABLED* ✅

📌 Deleted messages will be recovered and sent to your chat.

${settings.footer}`
                });
                return;
            }

            if (action === 'off') {
                global.antiDelete = false;
                await conn.sendMessage(chatId, {
                    text: `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   👑 QUEEN BELLA MD V1   ┃
┃   Created by Dev RODGERS  ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

🗑️ *ANTI DELETE: DISABLED* ❌

📌 Deleted messages will NOT be recovered.

${settings.footer}`
                });
                return;
            }

            // Show current status
            const status = global.antiDelete ? '✅ ENABLED' : '❌ DISABLED';
            await conn.sendMessage(chatId, {
                text: `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   👑 QUEEN BELLA MD V1   ┃
┃   Created by Dev RODGERS  ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

🗑️ *ANTI DELETE STATUS*

Status: ${status}

📌 To change:
• .antidelete on  — Enable
• .antidelete off — Disable

${settings.footer}`
            });

        } catch (error) {
            console.error('Error in antidelete:', error);
            await conn.sendMessage(chatId, {
                react: { text: '❌', key: mek.key }
            });
            await conn.sendMessage(chatId, {
                text: '❌ Error in anti-delete command.'
            });
        }
    }
};