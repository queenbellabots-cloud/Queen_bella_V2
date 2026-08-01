/**
 * 👑 QUEEN BELLA MD - Auto Status Control
 * Control automatic status viewing and reacting
 */

const settings = require('../settings');

// Runtime toggles — override config values without editing settings.js
if (global.autoStatusFlags === undefined) {
    global.autoStatusFlags = {
        seen: null,   // null = use config default, true/false = runtime override
        react: null,
    };
}

const FLAGS = global.autoStatusFlags;

module.exports = {
    name: 'autoviewstatus',
    aliases: ['autoview', 'autolike', 'autoreact', 'autostatus', 'statusconfig', 'avs'],
    category: 'status',
    description: 'Control automatic status viewing and reacting',
    usage: '.autoview on/off | .autolike on/off | .autostatus',
    react: '⚙️',
    async execute(conn, mek, args, chatId, isOwner) {
        try {
            // Only owner can use this command
            if (!isOwner) {
                await conn.sendMessage(chatId, {
                    text: '🔒 *Auto-Status Control*\n\nOnly the bot owner can change these settings.'
                });
                return;
            }

            const rawCmd = args[0]?.toLowerCase() || '';
            const sub = args[1]?.toLowerCase() || '';

            // ── .autostatus / .statusconfig — show current state ─────────────────
            if (rawCmd === 'autostatus' || rawCmd === 'statusconfig' || rawCmd === '') {
                const seenEff = FLAGS.seen !== null ? FLAGS.seen : true;
                const reactEff = FLAGS.react !== null ? FLAGS.react : true;
                const seenSrc = FLAGS.seen !== null ? '_(runtime)_' : '_(default)_';
                const reactSrc = FLAGS.react !== null ? '_(runtime)_' : '_(default)_';

                const statusText = `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   👑 QUEEN BELLA MD V1   ┃
┃   Created by Dev RODGERS  ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

📊 *AUTO-STATUS SETTINGS*

👁️ *Auto View:*   ${seenEff ? '✅ ON' : '❌ OFF'}  ${seenSrc}
❤️ *Auto React:*  ${reactEff ? '✅ ON' : '❌ OFF'}  ${reactSrc}

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  📋 COMMANDS                  ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
• .autoview on  — View all statuses
• .autoview off — Stop viewing statuses
• .autolike on  — React to all statuses
• .autolike off — Stop reacting to statuses
• .autostatus   — Show this panel

${settings.footer}`;

                await conn.sendMessage(chatId, { text: statusText });
                return;
            }

            // ── .autoview on/off ──────────────────────────────────────────────────
            if (rawCmd === 'autoview') {
                if (sub !== 'on' && sub !== 'off') {
                    const eff = FLAGS.seen !== null ? FLAGS.seen : true;
                    await conn.sendMessage(chatId, {
                        text: `👁️ *Auto View* is currently *${eff ? 'ON' : 'OFF'}*\n\nUsage: .autoview on or .autoview off`
                    });
                    return;
                }
                FLAGS.seen = sub === 'on';
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

            // ── .autolike / .autoreact on/off ─────────────────────────────────────
            if (rawCmd === 'autolike' || rawCmd === 'autoreact') {
                if (sub !== 'on' && sub !== 'off') {
                    const eff = FLAGS.react !== null ? FLAGS.react : true;
                    await conn.sendMessage(chatId, {
                        text: `❤️ *Auto React* is currently *${eff ? 'ON' : 'OFF'}*\n\nUsage: .autolike on or .autolike off`
                    });
                    return;
                }
                FLAGS.react = sub === 'on';
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
                text: `❌ Unknown command.\n\nAvailable commands:\n.autoview on/off\n.autolike on/off\n.autostatus`
            });

        } catch (error) {
            console.error('Error in autoviewstatus:', error);
            await conn.sendMessage(chatId, {
                text: '❌ Error in auto-status command.'
            });
        }
    }
};
