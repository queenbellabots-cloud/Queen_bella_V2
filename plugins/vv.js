/**
 * 👑 QUEEN BELLA MD - View Once Reveal Command
 * Reveals view-once images and videos
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
            // Check if replying to a message
            const quoted = mek.message?.extendedTextMessage?.contextInfo?.quotedMessage;

            if (!quoted) {
                await conn.sendMessage(chatId, { 
                    text: '❌ Reply to a *view-once image or video* with .vv'
                });
                return;
            }

            // Handle view-once wrapper (Baileys v6+)
            const viewOnceMsg = quoted.viewOnceMessageV2 || quoted.viewOnceMessage || null;

            const mediaMessage = viewOnceMsg?.message?.imageMessage ||
                                 viewOnceMsg?.message?.videoMessage ||
                                 quoted.imageMessage ||
                                 quoted.videoMessage;

            if (!mediaMessage) {
                await conn.sendMessage(chatId, { 
                    text: '❌ Unsupported message type. Reply to an image or video.'
                });
                return;
            }

            // Check if it's view-once
            if (!mediaMessage.viewOnce) {
                await conn.sendMessage(chatId, { 
                    text: '❌ This is not a view-once media.'
                });
                return;
            }

            // Determine media type
            const isImage = !!mediaMessage.imageMessage || mediaMessage.mimetype?.startsWith("image");
            const isVideo = !!mediaMessage.videoMessage || mediaMessage.mimetype?.startsWith("video");

            // React to command
            const reactionEmojis = ['🔥', '⚡', '🚀', '💨', '🎯', '🎉', '🌟', '💥', '👁️'];
            const reactEmoji = reactionEmojis[Math.floor(Math.random() * reactionEmojis.length)];

            await conn.sendMessage(chatId, {
                react: { text: reactEmoji, key: mek.key }
            });

            // Download media
            const stream = await downloadContentFromMessage(
                mediaMessage,
                isImage ? "image" : "video"
            );

            let buffer = Buffer.from([]);
            for await (const chunk of stream) {
                buffer = Buffer.concat([buffer, chunk]);
            }

            // Send revealed media (NOT view-once)
            await conn.sendMessage(chatId, {
                [isImage ? "image" : "video"]: buffer,
                caption: mediaMessage.caption || `👑 Revealed by QUEEN BELLA MD\n\n${settings.footer}`,
                contextInfo: {
                    mentionedJid: [chatId],
                    forwardingScore: 999,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: settings.channelId || "120363423209691396@newsletter",
                        newsletterName: settings.channelName || "👑 QUEEN BELLA MD 👑",
                        serverMessageId: 1
                    }
                }
            });

        } catch (error) {
            console.error('VV Command Error:', error);
            await conn.sendMessage(chatId, { 
                text: '❌ Failed to reveal view-once media. Make sure you replied to a view-once message.'
            });
        }
    }
};