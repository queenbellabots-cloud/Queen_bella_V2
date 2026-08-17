/**
 * 👑 QUEEN BELLA MD - Bot Mode
 * Owner = The number that paired with the bot
 */

const settings = require('../settings');

const REACTIONS = ['🔒', '🌍', '🔓', '🛡️', '⚙️'];

// ═══════════════════════════════════════════════════════
// 🔧 BETTER NUMBER CLEANING
// ═══════════════════════════════════════════════════════
function cleanNumber(num) {
    if (!num) return '';
    
    // Remove everything after @
    let cleaned = num.split('@')[0];
    
    // Remove any non-numeric characters
    cleaned = cleaned.replace(/[^0-9]/g, '');
    
    // Keep only the first 12-15 digits (phone number part)
    // WhatsApp sometimes adds extra digits at the end
    // Standard phone numbers are 10-15 digits
    if (cleaned.length > 15) {
        cleaned = cleaned.substring(0, 15);
    }
    
    // If it has the country code (254) and extra digits after
    // We want the base number without the suffix
    // For Kenyan numbers: 254XXXXXXXXX (12 digits)
    // If it's longer than 12 digits, trim it
    if (cleaned.startsWith('254') && cleaned.length > 12) {
        cleaned = cleaned.substring(0, 12);
    }
    
    return cleaned;
}

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
            const senderNumber = cleanNumber(sender);
            
            // Get the bot's OWN number (the number that paired)
            const botJid = conn.user.id;
            const botNumber = cleanNumber(botJid);

            // DEBUG - Log the numbers for troubleshooting
            console.log('🔍 DEBUG - Number Check:');
            console.log(`   Sender raw: ${sender}`);
            console.log(`   Sender cleaned: ${senderNumber}`);
            console.log(`   Bot raw: ${botJid}`);
            console.log(`   Bot cleaned: ${botNumber}`);
            
            // The owner is the number that PAIRED with the bot
            const isBotOwner = 
                senderNumber === botNumber ||
                cleanNumber(sender) === cleanNumber(botJid) ||
                senderNumber.includes(botNumber) ||
                botNumber.includes(senderNumber);

            // Developer (hardcoded - RODGERS)
            const developerNumber = settings.developerNumber || '254755660053';
            const isDeveloper = 
                senderNumber === developerNumber ||
                cleanNumber(sender) === developerNumber;

            // Sudo users
            const isSudo = settings.sudoUsers && settings.sudoUsers.some(sudo => 
                senderNumber === sudo || cleanNumber(sender) === sudo
            );

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

💡 *Tip:* Make sure your number is correct in settings.js

🔍 *Debug Info:*
Raw Sender: ${sender}
Cleaned Sender: ${senderNumber}
Raw Bot: ${botJid}
Cleaned Bot: ${botNumber}

${settings.footer}`
                });
                return;
            }

            // Rest of the command...
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