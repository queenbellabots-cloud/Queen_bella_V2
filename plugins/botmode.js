/**
 * 👑 QUEEN BELLA MD - Bot Mode Control
 * Public: Anyone can use commands
 * Private: Only the bot owner can use commands
 * ✅ BOT OWNER CAN USE THIS (not blocked)
 */

const settings = require('../settings');
const fs = require('fs');
const path = require('path');

// Global bot mode
if (global.botMode === undefined) {
    global.botMode = 'public'; // Default: public
}

module.exports = {
    name: 'botmode',
    aliases: ['mode', 'setmode', 'public', 'private'],
    category: 'owner',
    description: 'Set bot to public or private mode',
    usage: '.botmode public/private',
    react: '🔐',
    async execute(conn, mek, args, chatId, isOwner) {
        try {
            // 👇 REACT WITH LOCK EMOJI
            await conn.sendMessage(chatId, {
                react: { text: '🔐', key: mek.key }
            });

            // ✅ CHECK IF USER IS THE BOT OWNER (person who deployed)
            // The isOwner parameter comes from main.js - it checks against settings.ownerNumber
            if (!isOwner) {
                await conn.sendMessage(chatId, {
                    text: `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   👑 QUEEN BELLA MD V1   ┃
┃   Created by Dev RODGERS  ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

🔒 *ACCESS DENIED*

Only the bot owner can change the bot mode.

👑 *Owner:* ${settings.botOwner || 'QUEEN BELLA USER'}
📱 *Number:* ${settings.ownerNumber || '254755660053'}

${settings.footer}`
                });
                return;
            }

            const mode = args[0]?.toLowerCase();

            if (!mode || (mode !== 'public' && mode !== 'private')) {
                const currentMode = global.botMode || 'public';
                await conn.sendMessage(chatId, {
                    text: `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   👑 QUEEN BELLA MD V1   ┃
┃   Created by Dev RODGERS  ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

🔐 *BOT MODE CONTROL*

📌 *Current Mode:* ${currentMode.toUpperCase()}

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  📋 MODES                     ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

🌐 *PUBLIC MODE*
• Anyone can use commands
• Works in all chats
• Full access for everyone

🔒 *PRIVATE MODE*
• Only you (the bot owner) can use commands
• Others will be blocked
• Your bot, your rules!

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  📋 USAGE                    ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
• .botmode public   — Set to public mode
• .botmode private  — Set to private mode
• .botmode          — Check current mode

${settings.footer}`
                });
                return;
            }

            // Update the mode
            global.botMode = mode;

            await conn.sendMessage(chatId, {
                react: { text: mode === 'public' ? '🌐' : '🔒', key: mek.key }
            });

            await conn.sendMessage(chatId, {
                text: `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   👑 QUEEN BELLA MD V1   ┃
┃   Created by Dev RODGERS  ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

🔐 *BOT MODE CHANGED!*

📌 *New Mode:* ${mode.toUpperCase()}

${mode === 'public' ? '🌐 *PUBLIC MODE ACTIVATED!*\n\n✅ Anyone can now use the bot commands.\n✅ All chats are accessible.\n\n📌 Your bot is now open to everyone!' : '🔒 *PRIVATE MODE ACTIVATED!*\n\n✅ Only you can use the bot commands.\n❌ Others will be blocked.\n\n📌 Your bot is now private!'}

🔄 Mode has been saved.

${settings.footer}`
            });

        } catch (error) {
            console.error('Error in botmode:', error);
            await conn.sendMessage(chatId, {
                react: { text: '❌', key: mek.key }
            });
            await conn.sendMessage(chatId, {
                text: `❌ Error changing bot mode: ${error.message}`
            });
        }
    }
};