/**
 * 👑 QUEEN BELLA MD - Anti-Call Command
 * Auto-rejects calls with custom message
 * ✅ EVERYONE CAN USE
 */

const settings = require('../settings');
const fs = require('fs');
const path = require('path');

// Store custom messages per user
const CALL_MESSAGES_PATH = './data/call_messages.json';

// Ensure data directory exists
if (!fs.existsSync('./data')) fs.mkdirSync('./data');
if (!fs.existsSync(CALL_MESSAGES_PATH)) {
    fs.writeFileSync(CALL_MESSAGES_PATH, JSON.stringify({}, null, 2));
}

// Load call messages
function loadCallMessages() {
    try {
        return JSON.parse(fs.readFileSync(CALL_MESSAGES_PATH));
    } catch (e) {
        return {};
    }
}

// Save call messages
function saveCallMessages(data) {
    try {
        fs.writeFileSync(CALL_MESSAGES_PATH, JSON.stringify(data, null, 2));
    } catch (e) {
        console.error('Error saving call messages:', e);
    }
}

module.exports = {
    name: 'anticall',
    aliases: ['ac', 'callblock', 'rejectcalls'],
    category: 'tools',
    description: 'Auto-reject calls with custom message',
    usage: '.anticall on/off | .anticallmsg <message>',
    react: '📞',
    async execute(conn, mek, args, chatId, isOwner) {
        try {
            await conn.sendMessage(chatId, {
                react: { text: '📞', key: mek.key }
            });

            // ✅ REMOVED OWNER CHECK - EVERYONE CAN USE!

            const action = args[0]?.toLowerCase();

            // ── Show current status ──────────────────────────────────────────────────
            if (!action || action === 'status') {
                const callMessages = loadCallMessages();
                const userMsg = callMessages[chatId] || settings.callMessage || '📞 Call rejected. Please message instead.';
                const status = global.antiCall ? '✅ ON' : '❌ OFF';

                await conn.sendMessage(chatId, {
                    text: `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   👑 QUEEN BELLA MD V1   ┃
┃   Created by Dev RODGERS  ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

📞 *ANTI-CALL SETTINGS*

📌 *Status:* ${status}
📝 *Your Custom Message:*
"${userMsg}"

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  📋 COMMANDS                  ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
• .anticall on/off       — Enable/disable
• .anticallmsg <text>    — Set custom message
• .anticall              — Show status

${settings.footer}`
                });
                return;
            }

            // ── Toggle on/off ──────────────────────────────────────────────────────
            if (action === 'on') {
                global.antiCall = true;
                await conn.sendMessage(chatId, {
                    react: { text: '✅', key: mek.key }
                });
                await conn.sendMessage(chatId, {
                    text: `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   👑 QUEEN BELLA MD V1   ┃
┃   Created by Dev RODGERS  ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

✅ *ANTI-CALL ENABLED!*

📞 All incoming calls will be automatically rejected.

📝 *Current Message:*
"${loadCallMessages()[chatId] || settings.callMessage || '📞 Call rejected. Please message instead.'}"

📌 To change message: .anticallmsg <text>

${settings.footer}`
                });
                return;
            }

            if (action === 'off') {
                global.antiCall = false;
                await conn.sendMessage(chatId, {
                    react: { text: '❌', key: mek.key }
                });
                await conn.sendMessage(chatId, {
                    text: `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   👑 QUEEN BELLA MD V1   ┃
┃   Created by Dev RODGERS  ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

❌ *ANTI-CALL DISABLED!*

📞 Calls will no longer be automatically rejected.

${settings.footer}`
                });
                return;
            }

            // ── Unknown command ─────────────────────────────────────────────────────
            await conn.sendMessage(chatId, {
                text: `❌ Unknown command.

Available commands:
• .anticall on/off       — Enable/disable
• .anticallmsg <text>    — Set custom message
• .anticall              — Show status`
            });

        } catch (error) {
            console.error('Error in anticall:', error);
            await conn.sendMessage(chatId, {
                react: { text: '❌', key: mek.key }
            });
            await conn.sendMessage(chatId, {
                text: '❌ Error in anti-call command.'
            });
        }
    }
};