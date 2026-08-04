/**
 * 👑 QUEEN BELLA MD - Always Online
 * Keeps the bot always online with presence updates
 */

const settings = require('../settings');

// Different reaction emojis
const ONLINE_REACTIONS = ['🟢', '✅', '🌟', '✨', '💫', '⭐', '🌈', '🔥'];

// Global toggle
if (global.alwaysOnline === undefined) {
    global.alwaysOnline = true;
}

module.exports = {
    name: 'alwaysonline',
    aliases: ['online', 'stayonline', 'presence'],
    category: 'tools',
    description: 'Toggle always online mode',
    usage: '.alwaysonline on/off',
    react: '🟢',
    async execute(conn, mek, args, chatId, isOwner) {
        try {
            // 👇 REACT WITH RANDOM EMOJI
            const randomReact = ONLINE_REACTIONS[Math.floor(Math.random() * ONLINE_REACTIONS.length)];
            await conn.sendMessage(chatId, {
                react: { text: randomReact, key: mek.key }
            });

            // Only owner can change
            if (!isOwner) {
                await conn.sendMessage(chatId, {
                    text: '❌ Only the bot owner can change this setting.'
                });
                return;
            }

            const action = args[0]?.toLowerCase();

            // ── Turn ON ──────────────────────────────────────────────────────────────
            if (action === 'on') {
                global.alwaysOnline = true;
                
                // Send online presence
                await conn.sendPresenceUpdate('available', chatId);

                await conn.sendMessage(chatId, {
                    react: { text: '🟢', key: mek.key }
                });

                await conn.sendMessage(chatId, {
                    text: `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   👑 QUEEN BELLA MD V1   ┃
┃   Created by Dev RODGERS  ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

🟢 *ALWAYS ONLINE: ENABLED*

✅ Bot will now appear always online.
✅ Messages will show as read (✓✓)
✅ Status shows as "online"

📌 The bot will stay connected and responsive.

${settings.footer}`
                });
                return;
            }

            // ── Turn OFF ─────────────────────────────────────────────────────────────
            if (action === 'off') {
                global.alwaysOnline = false;
                
                // Set to offline/unavailable
                await conn.sendPresenceUpdate('unavailable', chatId);

                await conn.sendMessage(chatId, {
                    react: { text: '🔴', key: mek.key }
                });

                await conn.sendMessage(chatId, {
                    text: `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   👑 QUEEN BELLA MD V1   ┃
┃   Created by Dev RODGERS  ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

🔴 *ALWAYS ONLINE: DISABLED*

❌ Bot will now appear offline.
❌ Messages may not show as read immediately.
❌ Status shows as "last seen recently"

${settings.footer}`
                });
                return;
            }

            // ── Show current status ─────────────────────────────────────────────────
            const status = global.alwaysOnline ? '🟢 ONLINE' : '🔴 OFFLINE';
            
            await conn.sendMessage(chatId, {
                text: `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   👑 QUEEN BELLA MD V1   ┃
┃   Created by Dev RODGERS  ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

🟢 *ALWAYS ONLINE STATUS*

Status: ${status}

📌 To change: .alwaysonline on or .alwaysonline off

${settings.footer}`
            });

        } catch (error) {
            console.error('Error in alwaysonline:', error);
            await conn.sendMessage(chatId, {
                react: { text: '❌', key: mek.key }
            });
            await conn.sendMessage(chatId, {
                text: '❌ Error in always online command.'
            });
        }
    }
};