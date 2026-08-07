/**
 * 👑 QUEEN BELLA MD - Sticker Maker Command (No FFmpeg)
 */

const settings = require('../settings');
const { downloadContentFromMessage } = require('@whiskeysockets/baileys');
const sharp = require('sharp');

module.exports = {
    name: 'sticker',
    aliases: ['s', 'stick'],
    category: 'media',
    description: 'Convert image to sticker',
    usage: '.sticker (reply to image)',
    react: '🎨',
    async execute(conn, mek, args, chatId, isOwner) {
        try {
            await conn.sendMessage(chatId, {
                react: { text: '🎨', key: mek.key }
            });

            const quoted = mek.message?.extendedTextMessage?.contextInfo?.quotedMessage;
            if (!quoted) {
                await conn.sendMessage(chatId, {
                    text: '❌ Please reply to an image.\n\n*Usage:* Reply to an image with .sticker'
                });
                return;
            }

            const isImage = !!quoted.imageMessage;
            if (!isImage) {
                await conn.sendMessage(chatId, {
                    text: '❌ Please reply to an image (video stickers not supported in this version).'
                });
                return;
            }

            const packname = args[0] || settings.botName || 'QUEEN BELLA MD';
            const author = args[1] || settings.botOwner || 'Dev RODGERS';

            await conn.sendMessage(chatId, {
                text: '🎨 *Creating sticker...*'
            });

            const stream = await downloadContentFromMessage(quoted.imageMessage, 'image');
            let buffer = Buffer.from([]);
            for await (const chunk of stream) {
                buffer = Buffer.concat([buffer, chunk]);
            }

            // Resize and convert to webp (sticker format)
            const stickerBuffer = await sharp(buffer)
                .resize(512, 512, {
                    fit: 'cover',
                    position: 'center'
                })
                .webp({
                    quality: 80,
                    lossless: true
                })
                .toBuffer();

            await conn.sendMessage(chatId, {
                sticker: stickerBuffer,
                mimetype: 'image/webp',
                contextInfo: {
                    forwardingScore: 999,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: settings.channelId,
                        newsletterName: settings.channelName,
                        serverMessageId: 1
                    }
                }
            });

            await conn.sendMessage(chatId, {
                react: { text: '✅', key: mek.key }
            });

        } catch (error) {
            console.error('Error in sticker:', error);
            await conn.sendMessage(chatId, {
                react: { text: '❌', key: mek.key }
            });
            await conn.sendMessage(chatId, {
                text: `❌ Error creating sticker: ${error.message}`
            });
        }
    }
};