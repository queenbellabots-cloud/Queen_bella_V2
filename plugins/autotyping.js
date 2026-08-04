/**
 * 👑 QUEEN BELLA MD - Auto Typing Command
 * Shows typing indicator when someone sends a message
 */

const settings = require('../settings');

// Global toggle for auto-typing
if (global.autoTyping === undefined) {
    global.autoTyping = {
        enabled: true,
        dm: true,      // Private messages
        groups: true,  // Group messages
        status: true   // Status updates
    };
}

module.exports = {
    name: 'autotyping',
    aliases: ['autotype', 'typing', 'at'],
    category: 'tools',
    description: 'Toggle auto-typing indicator',
    usage: '.autotyping on/off | .autotyping dm/groups/status',
    react: '⌨️',
    async execute(conn, mek, args, chatId, isOwner) {
        try {
            // 👇 REACT WITH KEYBOARD EMOJI
            await conn.sendMessage(chatId, {
                react: { text: '⌨️', key: mek.key }
            });

            const action = args[0]?.toLowerCase();
            const subAction = args[1]?.toLowerCase();

            // Show current status
            if (!action || action === 'status') {
                const statusText = `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   👑 QUEEN BELLA MD V1   ┃
┃   Created by Dev RODGERS  ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

⌨️ *AUTO-TYPING STATUS*

📌 *Enabled:* ${global.autoTyping.enabled ? '✅ YES' : '❌ NO'}
👤 *Private DM:* ${global.autoTyping.dm ? '✅ ON' : '❌ OFF'}
👥 *Groups:* ${global.autoTyping.groups ? '✅ ON' : '❌ OFF'}
📱 *Status:* ${global.autoTyping.status ? '✅ ON' : '❌ OFF'}

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  📋 COMMANDS                  ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
• .autotyping on/off         — Enable/disable all
• .autotyping dm on/off      — Toggle private DMs
• .autotyping groups on/off  — Toggle groups
• .autotyping status on/off  — Toggle status

${settings.footer}`;

                await conn.sendMessage(chatId, { text: statusText });
                return;
            }

            // ── Toggle all on/off ──────────────────────────────────────────────────
            if (action === 'on' || action === 'off') {
                const newState = action === 'on';
                global.autoTyping.enabled = newState;
                global.autoTyping.dm = newState;
                global.autoTyping.groups = newState;
                global.autoTyping.status = newState;

                await conn.sendMessage(chatId, {
                    react: { text: '✅', key: mek.key }
                });

                await conn.sendMessage(chatId, {
                    text: `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   👑 QUEEN BELLA MD V1   ┃
┃   Created by Dev RODGERS  ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

⌨️ *AUTO-TYPING ${action.toUpperCase()}*

✅ All auto-typing features ${action === 'on' ? 'enabled' : 'disabled'}!

📌 ${action === 'on' ? 'Bot will show typing indicator for all messages' : 'Bot will not show typing indicator for any messages'}

${settings.footer}`
                });
                return;
            }

            // ── Toggle specific features ───────────────────────────────────────────
            const validFeatures = ['dm', 'groups', 'status'];
            if (validFeatures.includes(action) && (subAction === 'on' || subAction === 'off')) {
                const newState = subAction === 'on';
                global.autoTyping[action] = newState;

                // If any feature is off, set enabled to true (but feature controls individual)
                global.autoTyping.enabled = true;

                const featureNames = {
                    dm: 'Private DMs',
                    groups: 'Groups',
                    status: 'Status Updates'
                };

                await conn.sendMessage(chatId, {
                    react: { text: '✅', key: mek.key }
                });

                await conn.sendMessage(chatId, {
                    text: `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   👑 QUEEN BELLA MD V1   ┃
┃   Created by Dev RODGERS  ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

⌨️ *AUTO-TYPING - ${featureNames[action].toUpperCase()}*

✅ ${featureNames[action]} ${newState ? 'enabled' : 'disabled'}!

📌 Bot will ${newState ? 'now' : 'no longer'} show typing indicator for ${featureNames[action].toLowerCase()}.

${settings.footer}`
                });
                return;
            }

            // ── Invalid command ─────────────────────────────────────────────────────
            await conn.sendMessage(chatId, {
                text: `❌ Invalid command.

Available commands:
• .autotyping on/off         — Enable/disable all
• .autotyping dm on/off      — Toggle private DMs
• .autotyping groups on/off  — Toggle groups
• .autotyping status on/off  — Toggle status
• .autotyping status         — Show current settings`
            });

        } catch (error) {
            console.error('Error in autotyping:', error);
            await conn.sendMessage(chatId, {
                react: { text: '❌', key: mek.key }
            });
            await conn.sendMessage(chatId, {
                text: '❌ Error in auto-typing command.'
            });
        }
    }
};