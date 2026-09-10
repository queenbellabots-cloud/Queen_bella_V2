/**
 * 👑 QUEEN BELLA MD - Wipe Specific Message
 * Deletes a specific bot message without trace
 */

const settings = require('../settings');

module.exports = {
    name: 'wipe',
    aliases: ['ghostdel', 'erase', 'cleandelete'],
    category: 'owner',
    description: 'Wipe a specific bot message without trace',
    usage: '.wipe (reply to bot message)',
    react: '🫥',
    async execute(conn, mek, args, chatId, isOwner) {
        try {
            const sender = mek.key.participant || mek.key.remoteJid;

            const quoted = mek.message?.extendedTextMessage?.contextInfo;

            if (!quoted || !quoted.stanzaId) {
                await conn.sendMessage(chatId, {
                    text: `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   🫥 WIPE SPECIFIC MESSAGE   ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

❌ *Reply to a bot message!*

📝 *Usage:*
.wipe (reply to the message you want to wipe)

💡 *Works on:*
• Text messages
• Images
• Videos
• Audio
• Stickers

🫥 *Deletes WITHOUT leaving a trace*

${settings.footer}`
                });
                return;
            }

            await conn.sendMessage(chatId, {
                react: { text: '🫥', key: mek.key }
            });

            // Silent delete — WhatsApp protocol message
            await conn.sendMessage(chatId, {
                delete: {
                    remoteJid: chatId,
                    fromMe: true,
                    id: quoted.stanzaId,
                    participant: quoted.participant || chatId
                }
            });

            // Also try silent protocolMessage approach
            try {
                await conn.sendMessage(chatId, {
                    protocolMessage: {
                        key: {
                            remoteJid: chatId,
                            fromMe: true,
                            id: quoted.stanzaId
                        },
                        type: 0
                    }
                });
            } catch (e) {}

            console.log(`🫥 Wiped message: ${quoted.stanzaId}`);

            // Remove the ✅ reaction (so no trace remains)
            setTimeout(async () => {
                try {
                    await conn.sendMessage(chatId, {
                        delete: {
                            remoteJid: chatId,
                            fromMe: true,
                            id: mek.key.id
                        }
                    });
                } catch (e) {}
            }, 800);

        } catch (error) {
            console.error('Wipe error:', error);
        }
    }
};