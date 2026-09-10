/**
 * 👑 QUEEN BELLA MD - Smart Reminder
 * Set smart reminders with natural time
 */

const settings = require('../settings');

module.exports = {
    name: 'remind',
    aliases: ['reminder', 'remember'],
    category: 'tools',
    description: 'Set a smart reminder',
    usage: '.remind <time> <message>',
    react: '⏰',
    async execute(conn, mek, args, chatId, isOwner) {
        try {
            const sender = mek.key.participant || mek.key.remoteJid;

            if (args.length < 2) {
                await conn.sendMessage(chatId, {
                    text: `⏰ *Smart Reminder*\n\nUsage: .remind <time> <message>\n\nExamples:\n.remind 10m Drink water\n.remind 2h Call mom\n.remind 1d Pay rent`
                });
                return;
            }

            const timeStr = args[0];
            const message = args.slice(1).join(' ');

            const match = timeStr.match(/^(\d+)(s|m|h|d)$/i);
            if (!match) {
                await conn.sendMessage(chatId, { text: '❌ Invalid time format. Use: 10s, 5m, 2h, 1d' });
                return;
            }

            const value = parseInt(match[1]);
            const unit = match[2].toLowerCase();
            let seconds = value;
            if (unit === 'm') seconds = value * 60;
            if (unit === 'h') seconds = value * 3600;
            if (unit === 'd') seconds = value * 86400;

            await conn.sendMessage(chatId, {
                react: { text: '⏰', key: mek.key }
            });

            await conn.sendMessage(chatId, {
                text: `⏰ *Reminder Set!*\n\n⏱️ In: ${timeStr}\n📝 Message: ${message}`
            });

            // Schedule reminder
            setTimeout(async () => {
                try {
                    await conn.sendMessage(chatId, {
                        text: `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   ⏰ REMINDER!               ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

📝 ${message}

⏰ *Time is up!*

${settings.footer}`,
                        contextInfo: { mentionedJid: [sender] }
                    });
                } catch (e) {}
            }, seconds * 1000);

        } catch (error) {
            console.error('Reminder error:', error);
            await conn.sendMessage(chatId, { text: '❌ Failed to set reminder.' });
        }
    }
};