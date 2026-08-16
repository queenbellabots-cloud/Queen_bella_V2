/**
 * 👑 QUEEN BELLA MD - Bot Mode
 * Switch between Public/Private mode
 * PRIVATE MODE = SILENT (no response to non-owners)
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
            const ownerNumber = settings.ownerNumber || '254755660053';

            // Check if user is owner
            if (senderNumber !== ownerNumber && !isOwner) {
                await conn.sendMessage(chatId, {
                    react: { text: '⛔', key: mek.key }
                });
                await conn.sendMessage(chatId, {
                    text: `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   ⛔ ACCESS DENIED           ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

❌ *This command is only for the bot owner!*

👑 *Owner:* ${settings.botOwner || 'QUEEN BELLA USER'}

${settings.footer}`
                });
                return;
            }

            // Check if args provided
            if (!args.length) {
                const currentMode = global.botMode || 'public';
                const modeEmoji = currentMode === 'private' ? '🔒' : '🌍';
                const modeStatus = currentMode === 'private' ? 'PRIVATE (Owner Only - SILENT)' : 'PUBLIC (Everyone)';
                
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
• Works in groups and DMs

🔒 *PRIVATE MODE* (SILENT)
• ONLY owner can use commands
• Non-owners get NO RESPONSE
• Commands are silently ignored

📌 *Change mode:*
.botmode public   → Everyone can use
.botmode private  → Only owner (SILENT)

${settings.footer}`
                });
                return;
            }

            const mode = args[0].toLowerCase();

            // Validate mode
            if (mode !== 'public' && mode !== 'private') {
                await conn.sendMessage(chatId, {
                    react: { text: '❌', key: mek.key }
                });
                await conn.sendMessage(chatId, {
                    text: `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   ❌ INVALID MODE            ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

❌ *Invalid mode!*

📝 *Valid modes:*
• public  → Everyone can use bot
• private → Only owner (SILENT)

📌 *Example:*
.botmode public

${settings.footer}`
                });
                return;
            }

            // Set the mode
            const randomReact = REACTIONS[Math.floor(Math.random() * REACTIONS.length)];
            await conn.sendMessage(chatId, {
                react: { text: randomReact, key: mek.key }
            });

            // Store mode globally
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

👑 *Changed by:* @${senderNumber}

🕐 *Updated:* ${new Date().toLocaleString()}

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  📢 JOIN OUR CHANNEL         ┃
┃  👇 Click the button below    ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

${settings.footer}`,
                contextInfo: {
                    mentionedJid: [sender]
                }
            });

            // Log the change
            console.log(`✅ Bot mode changed to: ${mode.toUpperCase()} by ${senderNumber}`);

        } catch (error) {
            console.error('Error in botmode command:', error);
            await conn.sendMessage(chatId, { 
                text: '❌ Error changing bot mode.'
            });
        }
    }
};