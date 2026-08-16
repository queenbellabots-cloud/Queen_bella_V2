/**
 * 👑 QUEEN BELLA MD - Bot Mode
 * Owner = The number that paired with the bot
 */

const settings = require('../settings');

const REACTIONS = ['🔒', '🌍', '🔓', '🛡️', '⚙️'];

module.exports = {
    name: 'botmode',
    aliases: ['mode', 'public', 'private'],
    category: 'owner',
    description: 'Switch bot between Public/Private mode',
    usage: '.botmode <public|private>',
    react: '⚙️',
    async execute(conn, mek, args, chatId, isOwner) {
        try {
            const sender = mek.key.participant || mek.key.remoteJid;
            const senderNumber = sender ? sender.split('@')[0] : '';

            // ═══════════════════════════════════════════════════════
            // 🔐 OWNER DETECTION - The number that paired with the bot
            // ═══════════════════════════════════════════════════════

            // Get the bot's OWN number (the number that paired)
            const botNumber = conn.user.id.split(':')[0];
            
            // The owner is the number that PAIRED with the bot
            const isBotOwner = 
                senderNumber === botNumber ||
                sender === botNumber + '@s.whatsapp.net';

            // Developer (hardcoded - RODGERS)
            const developerNumber = settings.developerNumber || '254755660053';
            const isDeveloper = 
                senderNumber === developerNumber ||
                sender === developerNumber + '@s.whatsapp.net';

            // Sudo users
            const isSudo = settings.sudoUsers && settings.sudoUsers.includes(senderNumber);

            // Final authorization
            const isAuthorized = isBotOwner || isDeveloper || isSudo || isOwner;

            if (!isAuthorized) {
                await conn.sendMessage(chatId, {
                    react: { text: '⛔', key: mek.key }
                });
                await conn.sendMessage(chatId, {
                    text: `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   ⛔ ACCESS DENIED           ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

❌ *This command is only for the bot owner!*

👑 *Owner (Paired Number):* ${botNumber}
📱 *Your Number:* ${senderNumber}

💡 *The owner is the number that paired with the bot.*

${settings.footer}`
                });
                return;
            }

            // If no args, show current mode
            if (!args.length) {
                const currentMode = settings.mode || global.botMode || 'public';
                const modeEmoji = currentMode === 'private' ? '🔒' : '🌍';
                const modeStatus = currentMode === 'private' ? 'PRIVATE (SILENT)' : 'PUBLIC';

                await conn.sendMessage(chatId, {
                    react: { text: 'ℹ️', key: mek.key }
                });
                await conn.sendMessage(chatId, {
                    text: `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   ⚙️ BOT MODE STATUS         ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

${modeEmoji} *Current Mode:* ${modeStatus}

📝 *What each mode does:*

🌍 *PUBLIC MODE*
• Everyone can use commands
• Bot responds to all users

🔒 *PRIVATE MODE* (SILENT)
• ONLY owner can use commands
• Non-owners get NO RESPONSE

📌 *Change mode:*
.botmode public   → Everyone can use
.botmode private  → Only owner (SILENT)

👑 *Owner (Paired Number):* ${botNumber}
👨‍💻 *Developer:* ${developerNumber}

${settings.footer}`
                });
                return;
            }

            const mode = args[0].toLowerCase();

            if (mode !== 'public' && mode !== 'private') {
                await conn.sendMessage(chatId, {
                    react: { text: '❌', key: mek.key }
                });
                await conn.sendMessage(chatId, {
                    text: `❌ Invalid mode!\n\nValid: public or private\nExample: .botmode public`
                });
                return;
            }

            const randomReact = REACTIONS[Math.floor(Math.random() * REACTIONS.length)];
            await conn.sendMessage(chatId, {
                react: { text: randomReact, key: mek.key }
            });

            // Update mode
            settings.mode = mode;
            global.botMode = mode;

            const modeEmoji = mode === 'private' ? '🔒' : '🌍';
            const modeStatus = mode === 'private' ? 'PRIVATE (SILENT)' : 'PUBLIC';
            const modeDescription = mode === 'private' 
                ? '🔒 ONLY owner can use commands. Non-owners get NO RESPONSE.' 
                : '🌍 Everyone can use the bot.';

            await conn.sendMessage(chatId, {
                text: `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   ✅ BOT MODE UPDATED        ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

${modeEmoji} *Mode:* ${modeStatus}

📝 *Description:* ${modeDescription}

👑 *Owner (Paired Number):* ${botNumber}
👨‍💻 *Developer:* ${developerNumber}

🕐 *Updated:* ${new Date().toLocaleString()}

${settings.footer}`
            });

            console.log(`✅ Bot mode changed to: ${mode.toUpperCase()} by ${senderNumber}`);

        } catch (error) {
            console.error('Error in botmode command:', error);
            await conn.sendMessage(chatId, { 
                text: '❌ Error changing bot mode.'
            });
        }
    }
};