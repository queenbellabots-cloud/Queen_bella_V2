/**
 * 👑 QUEEN BELLA MD - Set Custom Status / Typing Text
 * Changes the "typing..." text to anything you want
 * ✅ EVERYONE CAN USE
 */

const settings = require('../settings');

module.exports = {
    name: 'setstatus',
    aliases: ['settyping', 'changestatus', 'status'],
    category: 'tools',
    description: 'Change typing status text (e.g., "lying...", "crying...")',
    usage: '.setstatus <text>',
    react: '📝',
    async execute(conn, mek, args, chatId, isOwner) {
        try {
            await conn.sendMessage(chatId, {
                react: { text: '📝', key: mek.key }
            });

            // ✅ REMOVED OWNER CHECK - EVERYONE CAN USE!

            let statusText = args.join(' ');
            
            if (!statusText) {
                await conn.sendMessage(chatId, {
                    text: `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   👑 QUEEN BELLA MD V1   ┃
┃   Created by Dev RODGERS  ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

📝 *SET CUSTOM STATUS*

❌ Please provide a status text.

📋 *Examples:*
• .setstatus lying...
• .setstatus crying...
• .setstatus eating...
• .setstatus sleeping...
• .setstatus dancing...

📌 *Current Status:* ${global.customStatus || 'Typing...'}

${settings.footer}`
                });
                return;
            }

            global.customStatus = statusText;

            await conn.sendMessage(chatId, {
                react: { text: '✅', key: mek.key }
            });

            await conn.sendMessage(chatId, {
                text: `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   👑 QUEEN BELLA MD V1   ┃
┃   Created by Dev RODGERS  ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

✅ *STATUS CHANGED!*

📌 *New Status:* ${statusText}

📌 *Now when the bot is "typing", it will show:*
"${statusText}" instead of "typing..."

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  📢 JOIN OUR CHANNEL         ┃
┃  👇 Click the button below    ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

${settings.footer}`
            });

        } catch (error) {
            console.error('Error in setstatus:', error);
            await conn.sendMessage(chatId, {
                react: { text: '❌', key: mek.key }
            });
            await conn.sendMessage(chatId, {
                text: `❌ Error: ${error.message}`
            });
        }
    }
};