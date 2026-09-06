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

            // Get the actual media message (handles all view-once formats)
            let mediaMessage = null;
            let mediaType = null;

            // Check different view-once formats (Baileys v6+)
            if (quoted.viewOnceMessageV2) {
                mediaMessage = quoted.viewOnceMessageV2.message?.imageMessage ||
                              quoted.viewOnceMessageV2.message?.videoMessage;
            } else if (quoted.viewOnceMessage) {
                mediaMessage = quoted.viewOnceMessage.message?.imageMessage ||
                              quoted.viewOnceMessage.message?.videoMessage;
            } else if (quoted.imageMessage) {
                mediaMessage = quoted.imageMessage;
            } else if (quoted.videoMessage) {
                mediaMessage = quoted.videoMessage;
            }

            // If still no media, try digging deeper
            if (!mediaMessage) {
                // Try to find any media in the quoted message
                const possibleTypes = ['imageMessage', 'videoMessage'];
                for (const type of possibleTypes) {
                    if (quoted[type]) {
                        mediaMessage = quoted[type];
                        break;
                    }
                }
            }

            if (!mediaMessage) {
                await conn.sendMessage(chatId, { 
                    text: '❌ Could not find media in the replied message. Make sure it\'s an image or video.'
                });
                return;
            }

            // Determine media type
            const isImage = mediaMessage.mimetype?.startsWith("image") || 
                           mediaMessage.jpeg || 
                           mediaMessage.imageMessage;
            
            const isVideo = mediaMessage.mimetype?.startsWith("video") || 
                           mediaMessage.videoMessage;

            // Check if it's view-once
            if (!mediaMessage.viewOnce) {
                await conn.sendMessage(chatId, { 
                    text: '❌ This is not a view-once media. The media is already visible.'
                });
                return;
            }

            // React to command
            const reactionEmojis = ['🔥', '⚡', '🚀', '💨', '🎯', '🎉', '🌟', '💥', '👁️'];
            const reactEmoji = reactionEmojis[Math.floor(Math.random() * reactionEmojis.length)];

            await conn.sendMessage(chatId, {
                react: { text: reactEmoji, key: mek.key }
            });

            // Determine download type
            const downloadType = isImage ? "image" : "video";

            // Download media
            const stream = await downloadContentFromMessage(mediaMessage, downloadType);
            let buffer = Buffer.from([]);
            for await (const chunk of stream) {
                buffer = Buffer.concat([buffer, chunk]);
            }

            if (!buffer || buffer.length === 0) {
                throw new Error('Downloaded media is empty');
            }

            // Send revealed media (NOT view-once)
            const caption = mediaMessage.caption || `👑 Revealed by QUEEN BELLA MD\n\n${settings.footer}`;

            await conn.sendMessage(chatId, {
                [downloadType]: buffer,
                caption: caption,
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

            console.log(`✅ View-once revealed for ${chatId}`);

        } catch (error) {
            console.error('VV Command Error:', error);
            await conn.sendMessage(chatId, { 
                text: `❌ Failed to reveal view-once media: ${error.message}\n\nMake sure you replied to a view-once message.`
            });
        }
    }
};