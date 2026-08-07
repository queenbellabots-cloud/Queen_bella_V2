/**
 * 👑 QUEEN BELLA MD - FAQ
 */

const settings = require('../settings');

module.exports = {
    name: 'faq',
    aliases: ['questions', 'helpme'],
    category: 'help',
    description: 'Frequently asked questions',
    usage: '.faq',
    react: '❓',
    async execute(conn, mek, args, chatId, isOwner) {
        try {
            await conn.sendMessage(chatId, {
                react: { text: '❓', key: mek.key }
            });

            const faq = `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   👑 QUEEN BELLA MD V1   ┃
┃   Created by Dev RODGERS  ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

❓ *FREQUENTLY ASKED QUESTIONS*

🔹 *Q: How do I deploy the bot?*
A: Use .guide for step-by-step instructions.

🔹 *Q: How do I get my session ID?*
A: Use .session command.

🔹 *Q: The bot is offline, what do I do?*
A: Restart the bot using .restart or renew your server.

🔹 *Q: How do I update the bot?*
A: Use .update or .restart command.

🔹 *Q: The bot is not responding?*
A: Make sure the bot is online and you're messaging the bot number.

🔹 *Q: How to make bot admin in group?*
A: Add the bot number to the group and make it admin.

🔹 *Q: How to report a bug?*
A: Contact support using .support.

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  📢 JOIN OUR CHANNEL         ┃
┃  👇 Click the button below    ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

${settings.footer}`;

            await conn.sendMessage(chatId, { text: faq });

        } catch (error) {
            console.error('Error in faq:', error);
            await conn.sendMessage(chatId, {
                text: '❌ Error loading FAQ.'
            });
        }
    }
};