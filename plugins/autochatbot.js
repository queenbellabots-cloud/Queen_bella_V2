/**
 * 👑 QUEEN BELLA MD - Auto ChatBot
 * Auto-reply to DMs with AI
 */

const settings = require('../settings');
const axios = require('axios');

const AI_API = 'https://apis.davidcyril.name.ng/ai/gemini-3-pro';

module.exports = {
    name: 'autochatbot',
    aliases: ['autoreply', 'autodm', 'ab'],
    category: 'owner',
    description: 'Enable/disable auto-reply to DMs',
    usage: '.autochatbot <on|off|status>',
    react: '🤖',
    async execute(conn, mek, args, chatId, isOwner) {
        try {
            const sender = mek.key.participant || mek.key.remoteJid;
            const senderNumber = sender ? sender.split('@')[0] : '';
            const ownerNumber = settings.ownerNumber || '254755660053';

            // Check if user is authorized
            const isAuthorized = 
                senderNumber === ownerNumber ||
                isOwner ||
                (settings.sudoUsers && settings.sudoUsers.includes(senderNumber));

            if (!isAuthorized) {
                await conn.sendMessage(chatId, {
                    react: { text: '⛔', key: mek.key }
                });
                await conn.sendMessage(chatId, {
                    text: `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   ⛔ ACCESS DENIED           ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

❌ *This command is only for the bot owner!*

👑 *Owner:* ${ownerNumber}

${settings.footer}`
                });
                return;
            }

            // Check status
            if (!args.length || args[0].toLowerCase() === 'status') {
                const status = global.autoChatBot || false;
                const statusText = status ? '🟢 ENABLED' : '🔴 DISABLED';
                const statusEmoji = status ? '✅' : '❌';
                
                await conn.sendMessage(chatId, {
                    react: { text: status ? '✅' : '❌', key: mek.key }
                });
                await conn.sendMessage(chatId, {
                    text: `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   🤖 AUTO CHATBOT STATUS     ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

${statusEmoji} *Status:* ${statusText}

📝 *Description:*
${status ? 'Bot will auto-reply to all DMs with AI responses' : 'Auto-reply is currently OFF'}

📌 *Commands:*
.autochatbot on    → Enable auto-reply
.autochatbot off   → Disable auto-reply
.autochatbot status → Check status

${settings.footer}`
                });
                return;
            }

            const action = args[0].toLowerCase();

            if (action === 'on') {
                global.autoChatBot = true;
                await conn.sendMessage(chatId, {
                    react: { text: '✅', key: mek.key }
                });
                await conn.sendMessage(chatId, {
                    text: `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   ✅ AUTO CHATBOT ENABLED    ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

🤖 *Bot will now auto-reply to all DMs!*

📝 *How it works:*
• Any message sent to the bot will get an AI response
• Works in private DMs only
• AI will respond with Gemini-3-Pro

📌 *To disable:*
.autochatbot off

${settings.footer}`
                });
                return;
            }

            if (action === 'off') {
                global.autoChatBot = false;
                await conn.sendMessage(chatId, {
                    react: { text: '✅', key: mek.key }
                });
                await conn.sendMessage(chatId, {
                    text: `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   ❌ AUTO CHATBOT DISABLED   ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

🔴 *Bot will no longer auto-reply to DMs*

📌 *To re-enable:*
.autochatbot on

${settings.footer}`
                });
                return;
            }

            // Invalid action
            await conn.sendMessage(chatId, {
                react: { text: '❌', key: mek.key }
            });
            await conn.sendMessage(chatId, {
                text: `❌ Invalid action: ${action}\n\nValid: on, off, status`
            });

        } catch (error) {
            console.error('Error in autochatbot:', error);
            await conn.sendMessage(chatId, { 
                text: '❌ Error toggling auto-chatbot.'
            });
        }
    }
};