/**
 * 👑 QUEEN BELLA MD - Auto Status Control
 * Control automatic status viewing and reacting
 */

const settings = require('../settings');

// Runtime toggles
if (global.autoStatusFlags === undefined) {
    global.autoStatusFlags = {
        seen: true,   // Auto-view status
        react: true,  // Auto-react to status
    };
}

const FLAGS = global.autoStatusFlags;

// Random reaction emojis from settings
const REACTION_EMOJIS = settings.statusReactions || [
    '🔥', '❤️', '😍', '👑', '✨', '🌟', '💯', '🎉', '💪', '👏',
    '🙌', '🤩', '😎', '💥', '⭐', '🌈', '🎊', '🎈', '💖', '💗',
    '💝', '💟', '❣️', '💕', '💞', '💓', '🧡', '💛', '💚', '💙',
    '💜', '🖤', '🤍', '🤎', '❤️‍🔥', '💘', '💌', '💋', '🫶', '💫'
];

module.exports = {
    name: 'autoviewstatus',
    aliases: ['autoview', 'autolike', 'autoreact', 'autostatus', 'statusconfig', 'avs'],
    category: 'status',
    description: 'Control automatic status viewing and reacting',
    usage: '.autosview on/off | .autosreact on/off',
    react: '⚙️',
    async execute(conn, mek, args, chatId, isOwner) {
        try {
            // 👇 REACT WITH SETTINGS EMOJI
            await conn.sendMessage(chatId, {
                react: { text: '⚙️', key: mek.key }
            });

            // ✅ REMOVED OWNER CHECK - EVERYONE CAN USE!

            const rawCmd = (args[0] || '').toLowerCase();
            const sub = (args[1] || '').toLowerCase();

            // ── .autostatus / .statusconfig — show current state ─────────────────
            if (rawCmd === 'autostatus' || rawCmd === 'statusconfig' || rawCmd === '') {
                const seenEff = FLAGS.seen !== null ? FLAGS.seen : true;
                const reactEff = FLAGS.react !== null ? FLAGS.react : true;

                const statusText = `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   👑 QUEEN BELLA MD V1   ┃
┃   Created by Dev RODGERS  ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

📊 *AUTO-STATUS SETTINGS*

👁️ *Auto View:*   ${seenEff ? '✅ ON' : '❌ OFF'}
❤️ *Auto React:*  ${reactEff ? '✅ ON' : '❌ OFF'}

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  📋 COMMANDS                  ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
• .autosview on/off     — View all statuses
• .autosreact on/off    — React to all statuses
• .autostatus           — Show this panel

${settings.footer}`;

                await conn.sendMessage(chatId, { text: statusText });
                return;
            }

            // ── .autosview on/off ──────────────────────────────────────────────────
            if (rawCmd === 'autosview') {
                if (sub !== 'on' && sub !== 'off') {
                    const eff = FLAGS.seen !== null ? FLAGS.seen : true;
                    await conn.sendMessage(chatId, {
                        text: `👁️ *Auto View* is currently *${eff ? 'ON' : 'OFF'}*\n\nUsage: .autosview on or .autosview off`
                    });
                    return;
                }
                FLAGS.seen = sub === 'on';
                await conn.sendMessage(chatId, {
                    react: { text: FLAGS.seen ? '👁️' : '🚫', key: mek.key }
                });
                await conn.sendMessage(chatId, {
                    text: FLAGS.seen
                        ? `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   👑 QUEEN BELLA MD V1   ┃
┃   Created by Dev RODGERS  ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

👁️ *Auto View: ON*

✅ Bot will now *view every status* as soon as it arrives.

${settings.footer}`
                        : `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   👑 QUEEN BELLA MD V1   ┃
┃   Created by Dev RODGERS  ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

👁️ *Auto View: OFF*

❌ Bot will stop automatically viewing statuses.

${settings.footer}`
                });
                return;
            }

            // ── .autosreact on/off ─────────────────────────────────────────────────────
            if (rawCmd === 'autosreact' || rawCmd === 'autoreact' || rawCmd === 'autolike') {
                if (sub !== 'on' && sub !== 'off') {
                    const eff = FLAGS.react !== null ? FLAGS.react : true;
                    await conn.sendMessage(chatId, {
                        text: `❤️ *Auto React* is currently *${eff ? 'ON' : 'OFF'}*\n\nUsage: .autosreact on or .autosreact off`
                    });
                    return;
                }
                FLAGS.react = sub === 'on';
                await conn.sendMessage(chatId, {
                    react: { text: FLAGS.react ? '❤️' : '💔', key: mek.key }
                });
                await conn.sendMessage(chatId, {
                    text: FLAGS.react
                        ? `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   👑 QUEEN BELLA MD V1   ┃
┃   Created by Dev RODGERS  ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

❤️ *Auto React: ON*

✅ Bot will now *react to every status* with an emoji.

${settings.footer}`
                        : `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   👑 QUEEN BELLA MD V1   ┃
┃   Created by Dev RODGERS  ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

❤️ *Auto React: OFF*

❌ Bot will stop automatically reacting to statuses.

${settings.footer}`
                });
                return;
            }

            // ── Unknown command ─────────────────────────────────────────────────────
            await conn.sendMessage(chatId, {
                text: `❌ Unknown command.\n\nAvailable commands:\n.autosview on/off\n.autosreact on/off\n.autostatus`
            });

        } catch (error) {
            console.error('Error in autoviewstatus:', error);
            await conn.sendMessage(chatId, {
                react: { text: '❌', key: mek.key }
            });
            await conn.sendMessage(chatId, {
                text: '❌ Error in auto-status command.'
            });
        }
    }
};