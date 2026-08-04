/**
 * 👑 QUEEN BELLA MD - Auto Status Control
 * Automatically views and reacts to status updates
 */

const settings = require('../settings');

// Custom reaction emojis from settings
const REACTION_EMOJIS = settings.statusReactions || [
    '🔥', '❤️', '😍', '👑', '✨', '🌟', '💯', '🎉', '💪', '👏',
    '🙌', '🤩', '😎', '💥', '⭐', '🌈', '🎊', '🎈', '💖', '💗',
    '💝', '💟', '❣️', '💕', '💞', '💓', '🧡', '💛', '💚', '💙',
    '💜', '🖤', '🤍', '🤎', '❤️‍🔥', '💘', '💌', '💋', '🫶', '💫'
];

// Runtime toggles
if (global.autoStatusFlags === undefined) {
    global.autoStatusFlags = {
        view: true,   // Auto-view status
        react: true,  // Auto-react to status
    };
}

module.exports = {
    name: 'autoviewstatus',
    aliases: ['avs', 'autostatus', 'statusconfig'],
    category: 'status',
    description: 'Control automatic status viewing and reacting',
    usage: '.autoviewstatus on/off | .autostatusreact on/off',
    react: '⚙️',
    async execute(conn, mek, args, chatId, isOwner) {
        try {
            // 👇 REACT WITH SETTINGS EMOJI
            await conn.sendMessage(chatId, {
                react: { text: '⚙️', key: mek.key }
            });

            // Only owner can change settings
            if (!isOwner) {
                await conn.sendMessage(chatId, {
                    text: '❌ Only the bot owner can change this setting.'
                });
                return;
            }

            const rawCmd = args[0]?.toLowerCase() || '';
            const sub = args[1]?.toLowerCase() || '';

            // ── .autoviewstatus on/off ──────────────────────────────────────────────
            if (rawCmd === 'on' || rawCmd === 'off') {
                const newState = rawCmd === 'on';
                global.autoStatusFlags.view = newState;
                
                await conn.sendMessage(chatId, {
                    react: { text: newState ? '✅' : '❌', key: mek.key }
                });

                await conn.sendMessage(chatId, {
                    text: `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   👑 QUEEN BELLA MD V1   ┃
┃   Created by Dev RODGERS  ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

👁️ *AUTO-VIEW STATUS*

Status: ${newState ? '✅ ENABLED' : '❌ DISABLED'}

📌 Bot will ${newState ? 'now' : 'no longer'} automatically view status updates.

${settings.footer}`
                });
                return;
            }

            // ── .autostatusreact on/off ────────────────────────────────────────────
            if (rawCmd === 'autostatusreact' || rawCmd === 'autoreact' || rawCmd === 'autolike') {
                if (sub !== 'on' && sub !== 'off') {
                    const currentState = global.autoStatusFlags.react ? 'ON' : 'OFF';
                    await conn.sendMessage(chatId, {
                        text: `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   👑 QUEEN BELLA MD V1   ┃
┃   Created by Dev RODGERS  ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

❤️ *AUTO-REACT STATUS*

Status: ${currentState === 'ON' ? '✅ ENABLED' : '❌ DISABLED'}

📌 To change: .autostatusreact on or .autostatusreact off

${settings.footer}`
                    });
                    return;
                }

                const newState = sub === 'on';
                global.autoStatusFlags.react = newState;

                await conn.sendMessage(chatId, {
                    react: { text: newState ? '❤️' : '💔', key: mek.key }
                });

                await conn.sendMessage(chatId, {
                    text: `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   👑 QUEEN BELLA MD V1   ┃
┃   Created by Dev RODGERS  ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

❤️ *AUTO-REACT STATUS*

Status: ${newState ? '✅ ENABLED' : '❌ DISABLED'}

📌 Bot will ${newState ? 'now' : 'no longer'} automatically react to status updates.

${settings.footer}`
                });
                return;
            }

            // ── Show current status ──────────────────────────────────────────────────
            const viewStatus = global.autoStatusFlags.view ? '✅ ON' : '❌ OFF';
            const reactStatus = global.autoStatusFlags.react ? '✅ ON' : '❌ OFF';

            await conn.sendMessage(chatId, {
                text: `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   👑 QUEEN BELLA MD V1   ┃
┃   Created by Dev RODGERS  ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

📊 *AUTO-STATUS SETTINGS*

👁️ *Auto View:*   ${viewStatus}
❤️ *Auto React:*  ${reactStatus}

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  📋 COMMANDS                  ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
• .autoviewstatus on/off    — Toggle auto-view
• .autostatusreact on/off   — Toggle auto-react
• .autoviewstatus           — Show this panel

${settings.footer}`
            });

        } catch (error) {
            console.error('Error in autoviewstatus:', error);
            await conn.sendMessage(chatId, {
                text: '❌ Error in auto-status command.'
            });
        }
    }
};