/**
 * 👑 QUEEN BELLA MD - Ghost Reader
 * Read ANY message WITHOUT showing blue ticks (stealth mode)
 */

const settings = require('../settings');

// In-memory storage
const ghostMode = new Map();

module.exports = {
    name: 'ghost',
    aliases: ['stealth', 'spy', 'silent'],
    category: 'tools',
    description: 'Read messages without showing blue ticks',
    usage: '.ghost on/off',
    react: '👻',
    async execute(conn, mek, args, chatId, isOwner) {
        try {
            const sender = mek.key.participant || mek.key.remoteJid;
            const senderNumber = sender.split('@')[0];

            const action = args[0]?.toLowerCase();

            if (!action) {
                const isOn = ghostMode.get(senderNumber) || false;
                await conn.sendMessage(chatId, {
                    text: `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   👻 GHOST MODE              ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

📊 *Status:* ${isOn ? '🟢 ACTIVE' : '🔴 INACTIVE'}

📝 *How it works:*
When ON, the bot reads your incoming messages
WITHOUT sending blue ticks to the sender!

📌 *Commands:*
.ghost on   → Enable ghost mode
.ghost off  → Disable ghost mode

${settings.footer}`
                });
                return;
            }

            if (action === 'on') {
                ghostMode.set(senderNumber, true);
                await conn.sendMessage(chatId, {
                    react: { text: '👻', key: mek.key }
                });
                await conn.sendMessage(chatId, {
                    text: `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   👻 GHOST MODE ACTIVATED    ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

✅ *Ghost Mode is now ON!*

📱 You can now read messages
without the sender knowing!

👀 Blue ticks will NOT appear
when you read their messages.

${settings.footer}`
                });
            } else if (action === 'off') {
                ghostMode.delete(senderNumber);
                await conn.sendMessage(chatId, {
                    react: { text: '✅', key: mek.key }
                });
                await conn.sendMessage(chatId, {
                    text: `👻 *Ghost Mode OFF*\n\nBlue ticks will now appear normally.`
                });
            }

        } catch (error) {
            console.error('Ghost error:', error);
        }
    }
};