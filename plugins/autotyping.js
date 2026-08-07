/**
 * 👑 QUEEN BELLA MD - Auto Typing
 * Auto-types every 10 seconds repeatedly
 * ✅ EVERYONE CAN USE
 */

const settings = require('../settings');

// Global toggle for auto-typing
if (global.autoTyping === undefined) {
    global.autoTyping = {
        enabled: false, // Default: OFF
        interval: null  // Store interval reference
    };
}

module.exports = {
    name: 'autotyping',
    aliases: ['autotype', 'typing', 'at'],
    category: 'tools',
    description: 'Auto-types every 10 seconds repeatedly',
    usage: '.autotyping on/off',
    react: '⌨️',
    async execute(conn, mek, args, chatId, isOwner) {
        try {
            // 👇 REACT WITH KEYBOARD EMOJI
            await conn.sendMessage(chatId, {
                react: { text: '⌨️', key: mek.key }
            });

            // ✅ REMOVED OWNER CHECK - EVERYONE CAN USE!

            const action = args[0]?.toLowerCase();

            // ── Show current status ──────────────────────────────────────────────────
            if (!action || action === 'status') {
                const statusText = `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   👑 QUEEN BELLA MD V1   ┃
┃   Created by Dev RODGERS  ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

⌨️ *AUTO-TYPING STATUS*

📌 *Status:* ${global.autoTyping.enabled ? '✅ ON' : '❌ OFF'}
📌 *Interval:* Every 10 seconds
📌 *Duration:* 10 seconds each time
📝 *Custom Status:* "${global.customStatus || 'composing'}"

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  📋 COMMANDS                  ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
• .autotyping on   — Start auto-typing
• .autotyping off  — Stop auto-typing
• .autotyping      — Show status

${settings.footer}`;

                await conn.sendMessage(chatId, { text: statusText });
                return;
            }

            // ── Turn ON ──────────────────────────────────────────────────────────────
            if (action === 'on') {
                // Clear existing interval if any
                if (global.autoTyping.interval) {
                    clearInterval(global.autoTyping.interval);
                    global.autoTyping.interval = null;
                }

                global.autoTyping.enabled = true;

                // Get the custom status text
                const statusText = global.customStatus || 'composing';

                await conn.sendMessage(chatId, {
                    react: { text: '✅', key: mek.key }
                });

                await conn.sendMessage(chatId, {
                    text: `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   👑 QUEEN BELLA MD V1   ┃
┃   Created by Dev RODGERS  ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

⌨️ *AUTO-TYPING ACTIVATED!*

✅ Bot will now type every 10 seconds
⏰ Typing duration: 10 seconds each time
📝 Shows: "${statusText}"

📌 *To stop:* .autotyping off

${settings.footer}`
                });

                // ── Start the auto-typing loop ──────────────────────────────────────
                let isTyping = false;
                let typingTimeout = null;

                global.autoTyping.interval = setInterval(async () => {
                    if (!global.autoTyping.enabled) {
                        clearInterval(global.autoTyping.interval);
                        global.autoTyping.interval = null;
                        return;
                    }

                    try {
                        // If currently typing, skip
                        if (isTyping) return;

                        isTyping = true;

                        // Get current status
                        const currentStatus = global.customStatus || 'composing';

                        // Send typing indicator
                        await conn.sendPresenceUpdate(currentStatus, chatId);
                        console.log(`⌨️ Auto-typing: "${currentStatus}"`);

                        // Stop typing after 10 seconds
                        typingTimeout = setTimeout(async () => {
                            try {
                                await conn.sendPresenceUpdate('paused', chatId);
                                console.log('⌨️ Auto-typing: paused');
                            } catch (e) {}

                            isTyping = false;
                            typingTimeout = null;
                        }, 10000); // 10 seconds typing

                    } catch (error) {
                        console.error('Auto-typing error:', error);
                        isTyping = false;
                        if (typingTimeout) {
                            clearTimeout(typingTimeout);
                            typingTimeout = null;
                        }
                    }
                }, 10000); // Every 10 seconds

                return;
            }

            // ── Turn OFF ─────────────────────────────────────────────────────────────
            if (action === 'off') {
                global.autoTyping.enabled = false;

                // Clear interval
                if (global.autoTyping.interval) {
                    clearInterval(global.autoTyping.interval);
                    global.autoTyping.interval = null;
                }

                // Stop any ongoing typing
                try {
                    await conn.sendPresenceUpdate('paused', chatId);
                } catch (e) {}

                await conn.sendMessage(chatId, {
                    react: { text: '❌', key: mek.key }
                });

                await conn.sendMessage(chatId, {
                    text: `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   👑 QUEEN BELLA MD V1   ┃
┃   Created by Dev RODGERS  ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

⌨️ *AUTO-TYPING DEACTIVATED!*

❌ Bot will no longer auto-type.

${settings.footer}`
                });

                return;
            }

            // ── Invalid command ─────────────────────────────────────────────────────
            await conn.sendMessage(chatId, {
                text: `❌ Invalid command.

Available commands:
• .autotyping on   — Start auto-typing
• .autotyping off  — Stop auto-typing
• .autotyping      — Show status`
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