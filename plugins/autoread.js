/**
 * 👑 QUEEN BELLA MD - Auto Read PM Command
 * Toggle auto-read for private messages
 */

const settings = require('../settings');

// Global toggle for auto-read PM
if (global.autoReadPM === undefined) {
    global.autoReadPM = false;
}

module.exports = {
    name: 'autoread',
    aliases: ['autoreadpm', 'readall', 'ar'],
    category: 'tools',
    description: 'Toggle auto-read for private messages',
    usage: '.autoread on/off',
    react: '📖',
    async execute(conn, mek, args, chatId, isOwner) {
        try {
            // 👇 REACT WITH READING EMOJI
            await conn.sendMessage(chatId, {
                react: { text: '📖', key: mek.key }
            });

            const arg = (args[0] || '').toLowerCase();
            let autoReadPM = global.autoReadPM || false;

            if (arg === 'on') {
                autoReadPM = true;
            } else if (arg === 'off') {
                autoReadPM = false;
            } else {
                // Toggle if no argument provided
                autoReadPM = !autoReadPM;
            }

            // Save to global
            global.autoReadPM = autoReadPM;

            const statusText = `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   👑 QUEEN BELLA MD V1   ┃
┃   Created by Dev RODGERS  ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

📖 *AUTO-READ PRIVATE MESSAGES*

Status: ${autoReadPM ? '✅ ENABLED' : '❌ DISABLED'}

📌 The bot will ${autoReadPM ? 'now' : 'no longer'} mark all incoming private messages as read.

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  📋 USAGE                    ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
• .autoread     — Toggle on/off
• .autoread on  — Enable auto-read
• .autoread off — Disable auto-read

${settings.footer}`;

            await conn.sendMessage(chatId, {
                text: statusText
            });

            // 👇 REACT WITH SUCCESS EMOJI
            await conn.sendMessage(chatId, {
                react: { text: '✅', key: mek.key }
            });

        } catch (error) {
            console.error('Error in autoread:', error);
            // 👇 REACT WITH ERROR EMOJI
            await conn.sendMessage(chatId, {
                react: { text: '❌', key: mek.key }
            });
            await conn.sendMessage(chatId, {
                text: '❌ Error in auto-read command.'
            });
        }
    }
};