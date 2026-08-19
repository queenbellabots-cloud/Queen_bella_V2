/**
 * 👑 QUEEN BELLA MD - Fake Reply
 * Reply to a message as if from another number
 */

const settings = require('../settings');

module.exports = {
    name: 'fake',
    aliases: ['fakemsg'],
    category: 'fun',
    description: 'Reply as fake number',
    usage: '.fake <number> <message> (reply to a message)',
    react: '🎭',
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
                    text: '⛔ Access Denied!'
                });
                return;
            }

            // Check if replying to a message
            const quoted = mek.message.extendedTextMessage?.contextInfo;
            if (!quoted || !quoted.quotedMessage) {
                await conn.sendMessage(chatId, {
                    react: { text: '❌', key: mek.key }
                });
                await conn.sendMessage(chatId, { 
                    text: '❌ Reply to a message!\n\n.fake <number> <message>'
                });
                return;
            }

            if (args.length < 2) {
                await conn.sendMessage(chatId, {
                    react: { text: '❌', key: mek.key }
                });
                await conn.sendMessage(chatId, { 
                    text: `❌ .fake <number> <message>\n\nExample: .fake 254755660053 Hello`
                });
                return;
            }

            await conn.sendMessage(chatId, {
                react: { text: '🎭', key: mek.key }
            });

            // Get the target number
            let targetNumber = args[0].replace(/[^0-9+]/g, '');
            
            if (!targetNumber.startsWith('+')) {
                if (targetNumber.length <= 9) {
                    targetNumber = '+254' + targetNumber;
                } else {
                    targetNumber = '+' + targetNumber;
                }
            }

            const fakeMessage = args.slice(1).join(' ');

            // Get the original message
            const originalMsg = quoted.quotedMessage;

            // Send as fake reply - JUST THE FAKE MESSAGE!
            await conn.sendMessage(chatId, {
                text: fakeMessage,
                contextInfo: {
                    participant: targetNumber + '@s.whatsapp.net',
                    quotedMessage: originalMsg,
                    mentionedJid: [targetNumber + '@s.whatsapp.net']
                }
            });

            console.log(`✅ Fake reply sent as ${targetNumber}`);

        } catch (error) {
            console.error('Error in fake command:', error);
            await conn.sendMessage(chatId, { 
                text: '❌ Error.'
            });
        }
    }
};