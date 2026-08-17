/**
 * 👑 QUEEN BELLA MD - Block User
 * Block a user from contacting the bot
 */

const settings = require('../settings');

module.exports = {
    name: 'block',
    aliases: ['blockuser'],
    category: 'owner',
    description: 'Block a user from the bot',
    usage: '.block @mention or reply to message',
    react: '🚫',
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

            let target;

            // Check if replying to a message
            if (mek.message.extendedTextMessage && mek.message.extendedTextMessage.contextInfo) {
                const quoted = mek.message.extendedTextMessage.contextInfo;
                if (quoted.participant) {
                    target = quoted.participant;
                }
            }

            // Check for mention
            if (!target) {
                const mentioned = mek.message.extendedTextMessage?.contextInfo?.mentionedJid || [];
                if (mentioned.length > 0) {
                    target = mentioned[0];
                }
            }

            if (!target) {
                await conn.sendMessage(chatId, {
                    react: { text: '❌', key: mek.key }
                });
                await conn.sendMessage(chatId, { 
                    text: '❌ Please reply to a message or mention a user to block.'
                });
                return;
            }

            await conn.updateBlockStatus(target, 'block');
            
            await conn.sendMessage(chatId, {
                react: { text: '✅', key: mek.key }
            });
            await conn.sendMessage(chatId, {
                text: `✅ User *${target.split('@')[0]}* has been blocked!`
            });

        } catch (error) {
            console.error('Error in block:', error);
            await conn.sendMessage(chatId, { 
                text: '❌ Error blocking user.'
            });
        }
    }
};