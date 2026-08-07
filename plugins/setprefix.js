/**
 * 👑 QUEEN BELLA MD - Set Prefix Command
 * Changes the bot command prefix
 */

const settings = require('../settings');
const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'setprefix',
    aliases: ['prefix', 'changeprefix'],
    category: 'owner',
    description: 'Change the bot command prefix',
    usage: '.setprefix <new_prefix>',
    react: '🔧',
    async execute(conn, mek, args, chatId, isOwner) {
        try {
            // 👇 REACT WITH WRENCH EMOJI
            await conn.sendMessage(chatId, {
                react: { text: '🔧', key: mek.key }
            });

            // Only owner can change prefix
            if (!isOwner) {
                await conn.sendMessage(chatId, {
                    text: '❌ Only the bot owner can change the prefix.'
                });
                return;
            }

            const newPrefix = args[0];

            if (!newPrefix) {
                await conn.sendMessage(chatId, {
                    text: `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   👑 QUEEN BELLA MD V1   ┃
┃   Created by Dev RODGERS  ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

🔧 *SET PREFIX*

📌 *Current Prefix:* ${settings.prefix || '.'}

📋 *Usage:* .setprefix <new_prefix>

📌 *Example:* .setprefix !

⚠️ *Note:* Prefix cannot be empty or contain spaces.

${settings.footer}`
                });
                return;
            }

            // Validate prefix
            if (newPrefix.length > 3) {
                await conn.sendMessage(chatId, {
                    text: '❌ Prefix must be 1-3 characters long.'
                });
                return;
            }

            if (newPrefix.includes(' ')) {
                await conn.sendMessage(chatId, {
                    text: '❌ Prefix cannot contain spaces.'
                });
                return;
            }

            // Update the settings object
            settings.prefix = newPrefix;
            global.prefix = newPrefix;

            // Update settings.js file
            const settingsPath = path.join(__dirname, '../settings.js');
            let settingsContent = fs.readFileSync(settingsPath, 'utf8');

            // Replace the prefix line
            const prefixRegex = /prefix:\s*["'].*["']/;
            const newPrefixLine = `prefix: "${newPrefix}"`;

            if (prefixRegex.test(settingsContent)) {
                settingsContent = settingsContent.replace(prefixRegex, newPrefixLine);
            } else {
                // If prefix line doesn't exist, add it
                settingsContent = settingsContent.replace(
                    /const settings = {/,
                    `const settings = {\n  prefix: "${newPrefix}",`
                );
            }

            fs.writeFileSync(settingsPath, settingsContent);

            await conn.sendMessage(chatId, {
                react: { text: '✅', key: mek.key }
            });

            await conn.sendMessage(chatId, {
                text: `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   👑 QUEEN BELLA MD V1   ┃
┃   Created by Dev RODGERS  ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

✅ *PREFIX CHANGED!*

📌 *New Prefix:* ${newPrefix}

📋 Now use ${newPrefix} before all commands.

📌 *Example:*
${newPrefix}menu
${newPrefix}ping
${newPrefix}help

🔄 Bot will now respond to ${newPrefix} commands.

${settings.footer}`
            });

        } catch (error) {
            console.error('Error in setprefix:', error);
            await conn.sendMessage(chatId, {
                react: { text: '❌', key: mek.key }
            });
            await conn.sendMessage(chatId, {
                text: `❌ Error changing prefix: ${error.message}`
            });
        }
    }
};