/**
 * 👑 QUEEN BELLA MD - Bot Mode Control
 * Public: Anyone can use commands
 * Private: Only the bot owner can use commands
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

            // ✅ ONLY OWNER CAN CHANGE MODE
            if (!isOwner) {
                await conn.sendMessage(chatId, {
                    text: '❌ Only the bot owner can change the bot mode.'
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
• Only bot owner can use commands
• Others will be blocked
• Owner-only access

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

            // Also update settings file
            try {
                const settingsPath = path.join(__dirname, '../settings.js');
                let settingsContent = fs.readFileSync(settingsPath, 'utf8');
                const modeRegex = /commandMode:\s*["'].*["']/;
                const newModeLine = `commandMode: "${mode}"`;

                if (modeRegex.test(settingsContent)) {
                    settingsContent = settingsContent.replace(modeRegex, newModeLine);
                } else {
                    settingsContent = settingsContent.replace(
                        /const settings = {/,
                        `const settings = {\n  commandMode: "${mode}",`
                    );
                }
                fs.writeFileSync(settingsPath, settingsContent);
            } catch (e) {
                console.error('Could not update settings file:', e);
            }

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

${mode === 'public' ? '🌐 *PUBLIC MODE ACTIVATED!*\n\n✅ Anyone can now use the bot commands.\n✅ All chats are accessible.' : '🔒 *PRIVATE MODE ACTIVATED!*\n\n✅ Only you can use the bot commands.\n✅ Others will be blocked.'}

🔄 Mode has been saved to settings.

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