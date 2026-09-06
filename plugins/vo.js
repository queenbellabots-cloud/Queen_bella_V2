/**
 * 👑 QUEEN BELLA MD - View Once Reveal Command
 */

const settings = require('../settings');
const { downloadContentFromMessage } = require('@whiskeysockets/baileys');

module.exports = {
    name: 'vv',
    aliases: ['viewonce', 'reveal', 'vo'],
    category: 'tools',
    description: 'Reveal view-once image or video',
    usage: '.vv (reply to view-once media)',
    react: '👁️',
    async execute(conn, mek, args, chatId, isOwner) {
        try {
            const quoted = mek.message?.extendedTextMessage?.contextInfo?.quotedMessage;

            if (!quoted) {
                await conn.sendMessage(chatId, { text: '❌ Reply to a view-once message.' });
                return;
            }

            // Get media message
            let msg = quoted.viewOnceMessageV2?.message || 
                     quoted.viewOnceMessage?.message || 
                     quoted;

            let media = msg.imageMessage || msg.videoMessage;

            if (!media) {
                await conn.sendMessage(chatId, { text: '❌ No media found.' });
                return;
            }

            if (!media.viewOnce) {
                await conn.sendMessage(chatId, { text: '❌ Not a view-once message.' });
                return;
            }

            const isImage = !!msg.imageMessage;
            const type = isImage ? 'image' : 'video';

            await conn.sendMessage(chatId, {
                react: { text: '👁️', key: mek.key }
            });

            const stream = await downloadContentFromMessage(media, type);
            let buffer = Buffer.from([]);
            for await (const chunk of stream) {
                buffer = Buffer.concat([buffer, chunk]);
            }

            await conn.sendMessage(chatId, {
                [type]: buffer,
                caption: `👑 Revealed\n\n${settings.footer}`
            });

        } catch (error) {
            console.error('VV Error:', error);
            await conn.sendMessage(chatId, { 
                text: '❌ Failed to reveal view-once media.'
            });
        }
    }
};