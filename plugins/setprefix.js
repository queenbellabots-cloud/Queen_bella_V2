/**
 * 👑 QUEEN BELLA MD - Set Prefix
 * Change the bot command prefix
 */

const settings = require('../settings');

module.exports = {
    name: 'setprefix',
    aliases: ['prefix', 'changeprefix'],
    category: 'owner',
    description: 'Change bot command prefix',
    usage: '.setprefix <new prefix>',
    react: '⚙️',
    async execute(conn, mek, args, chatId, isOwner) {
        try {
            const sender = mek.key.participant || mek.key.remoteJid;
            const ownerNumber = settings.ownerNumber || '254755660053';
            const isBotOwner = sender === ownerNumber + '@s.whatsapp.net' || 
                              sender === ownerNumber + '@c.us' ||
                              senderNumber === ownerNumber;

            if (!isBotOwner && !isOwner) {
                await conn.sendMessage(chatId, {
                    react: { text: '⛔', key: mek.key }
                });
                await conn.sendMessage(chatId, { 
                    text: '⛔ This command is for the bot owner only!'
                });
                return;
            }

            if (!args.length) {
                await conn.sendMessage(chatId, {
                    react: { text: '❌', key: mek.key }
                });
                await conn.sendMessage(chatId, { 
                    text: `❌ Please provide a new prefix!\n\nCurrent prefix: *${settings.prefix}*\nUsage: .setprefix !`
                });
                return;
            }

            const newPrefix = args[0];
            const oldPrefix = settings.prefix;
            settings.prefix = newPrefix;
            global.prefix = newPrefix;

            await conn.sendMessage(chatId, {
                react: { text: '✅', key: mek.key }
            });
            await conn.sendMessage(chatId, {
                text: `✅ Prefix changed from *${oldPrefix}* to *${newPrefix}*!\n\nAll commands now use: ${newPrefix}`
            });

        } catch (error) {
            console.error('Error in setprefix:', error);
            await conn.sendMessage(chatId, { 
                text: '❌ Error changing prefix.'
            });
        }
    }
};