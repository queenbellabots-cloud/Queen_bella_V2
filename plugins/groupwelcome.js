/**
 * 👑 QUEEN BELLA MD - Welcome & Goodbye Messages
 * Toggle welcome and goodbye messages in groups
 */

const settings = require('../settings');
const { isBotAdmin } = require('./checkadmin');
const fs = require('fs');
const path = require('path');

// Data file for welcome/goodbye settings
const DATA_PATH = './data/welcome_settings.json';

// Ensure data directory exists
if (!fs.existsSync('./data')) fs.mkdirSync('./data');
if (!fs.existsSync(DATA_PATH)) {
    fs.writeFileSync(DATA_PATH, JSON.stringify({}, null, 2));
}

// Different reaction emojis
const WELCOME_REACTIONS = ['✅', '🌟', '✨', '🎉', '👋', '🎊', '💫', '⭐'];
const GOODBYE_REACTIONS = ['👋', '🚫', '📴', '🔚', '💫', '✨', '🌟', '✅'];

// Function to get settings
function getGroupSettings(groupId) {
    try {
        const data = JSON.parse(fs.readFileSync(DATA_PATH));
        if (!data[groupId]) {
            data[groupId] = {
                welcome: true,
                goodbye: true
            };
            fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
        }
        return data[groupId];
    } catch (error) {
        console.error('Error reading settings:', error);
        return { welcome: true, goodbye: true };
    }
}

// Function to save settings
function saveGroupSettings(groupId, settingsData) {
    try {
        const data = JSON.parse(fs.readFileSync(DATA_PATH));
        data[groupId] = settingsData;
        fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Error saving settings:', error);
    }
}

// ==========================================
// 📥 WELCOME COMMAND
// ==========================================
module.exports = {
    name: 'welcome',
    aliases: ['welcomemsg', 'wmsg'],
    category: 'group',
    description: 'Turn welcome messages on or off',
    usage: '.welcome on/off',
    react: '✅',
    async execute(conn, mek, args, chatId, isOwner) {
        try {
            // 👇 REACT WITH RANDOM EMOJI
            const randomReact = WELCOME_REACTIONS[Math.floor(Math.random() * WELCOME_REACTIONS.length)];
            await conn.sendMessage(chatId, {
                react: { text: randomReact, key: mek.key }
            });

            // Check if in a group
            const isGroup = chatId.endsWith('@g.us');
            if (!isGroup) {
                await conn.sendMessage(chatId, {
                    text: '✨ This command is for groups only.'
                });
                return;
            }

            // ✅ CHECK IF BOT IS ADMIN (REQUIRED)
            const botAdmin = await isBotAdmin(conn, chatId);
            if (!botAdmin) {
                await conn.sendMessage(chatId, {
                    text: '❌ I need to be an admin to manage welcome settings.'
                });
                return;
            }

            // ✅ REMOVED USER ADMIN/OWNER CHECK - EVERYONE CAN TOGGLE WELCOME!

            const status = args[0]?.toLowerCase();

            if (!status || (status !== 'on' && status !== 'off')) {
                const settings = getGroupSettings(chatId);
                await conn.sendMessage(chatId, {
                    text: `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   👑 QUEEN BELLA MD V1   ┃
┃   Created by Dev RODGERS  ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

📌 *WELCOME SETTINGS*

Welcome: ${settings.welcome ? '✅ ON' : '❌ OFF'}

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  📋 USAGE                    ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
• .welcome on   — Enable welcome messages
• .welcome off  — Disable welcome messages

${settings.footer}`
                });
                return;
            }

            const settings = getGroupSettings(chatId);
            settings.welcome = status === 'on';
            saveGroupSettings(chatId, settings);

            await conn.sendMessage(chatId, {
                react: { text: status === 'on' ? '✅' : '❌', key: mek.key }
            });

            await conn.sendMessage(chatId, {
                text: `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   👑 QUEEN BELLA MD V1   ┃
┃   Created by Dev RODGERS  ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

🌟 *WELCOME ${status.toUpperCase()}!*

Welcome messages are now ${status === 'on' ? 'enabled' : 'disabled'}.

${settings.footer}`
            });

        } catch (error) {
            console.error('Error in welcome command:', error);
            await conn.sendMessage(chatId, {
                text: '⚠️ Error updating Welcome status.'
            });
        }
    }
};

// ==========================================
// 👋 GOODBYE COMMAND
// ==========================================
module.exports.goodbye = {
    name: 'goodbye',
    aliases: ['goodbyemsg', 'gmsg', 'leave'],
    category: 'group',
    description: 'Turn goodbye messages on or off',
    usage: '.goodbye on/off',
    react: '👋',
    async execute(conn, mek, args, chatId, isOwner) {
        try {
            // 👇 REACT WITH RANDOM EMOJI
            const randomReact = GOODBYE_REACTIONS[Math.floor(Math.random() * GOODBYE_REACTIONS.length)];
            await conn.sendMessage(chatId, {
                react: { text: randomReact, key: mek.key }
            });

            // Check if in a group
            const isGroup = chatId.endsWith('@g.us');
            if (!isGroup) {
                await conn.sendMessage(chatId, {
                    text: '✨ This command is for groups only.'
                });
                return;
            }

            // ✅ CHECK IF BOT IS ADMIN (REQUIRED)
            const botAdmin = await isBotAdmin(conn, chatId);
            if (!botAdmin) {
                await conn.sendMessage(chatId, {
                    text: '❌ I need to be an admin to manage goodbye settings.'
                });
                return;
            }

            // ✅ REMOVED USER ADMIN/OWNER CHECK - EVERYONE CAN TOGGLE GOODBYE!

            const status = args[0]?.toLowerCase();

            if (!status || (status !== 'on' && status !== 'off')) {
                const settings = getGroupSettings(chatId);
                await conn.sendMessage(chatId, {
                    text: `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   👑 QUEEN BELLA MD V1   ┃
┃   Created by Dev RODGERS  ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

📌 *GOODBYE SETTINGS*

Goodbye: ${settings.goodbye ? '✅ ON' : '❌ OFF'}

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  📋 USAGE                    ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
• .goodbye on   — Enable goodbye messages
• .goodbye off  — Disable goodbye messages

${settings.footer}`
                });
                return;
            }

            const settings = getGroupSettings(chatId);
            settings.goodbye = status === 'on';
            saveGroupSettings(chatId, settings);

            await conn.sendMessage(chatId, {
                react: { text: status === 'on' ? '✅' : '❌', key: mek.key }
            });

            await conn.sendMessage(chatId, {
                text: `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   👑 QUEEN BELLA MD V1   ┃
┃   Created by Dev RODGERS  ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

👋 *GOODBYE ${status.toUpperCase()}!*

Goodbye messages are now ${status === 'on' ? 'enabled' : 'disabled'}.

${settings.footer}`
            });

        } catch (error) {
            console.error('Error in goodbye command:', error);
            await conn.sendMessage(chatId, {
                text: '⚠️ Error updating Goodbye status.'
            });
        }
    }
};