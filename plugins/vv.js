/**
 * 👑 QUEEN BELLA MD - View Once Revealer
 * Privately reveals view-once media to the user's DM
 * Usage: Reply to view-once with .😍 or any emoji after prefix
 */

const settings = require('../settings');
const { downloadContentFromMessage } = require('@whiskeysockets/baileys');

module.exports = {
    name: 'vv',
    aliases: ['viewonce', 'reveal', 'vo'],
    category: 'tools',
    description: 'Privately reveal view-once media',
    usage: '.vv or .😍 (reply to view-once)',
    react: '👁️',
    async execute(conn, mek, args, chatId, isOwner) {
        try {
            // Get the sender's JID (for private DM)
            const sender = mek.key.participant || mek.key.remoteJid;
            const senderNumber = sender.split('@')[0];
            const senderJid = senderNumber + '@s.whatsapp.net';

            // Get quoted message
            const quoted = mek.message?.extendedTextMessage?.contextInfo?.quotedMessage;

            if (!quoted) {
                await conn.sendMessage(chatId, { 
                    text: '❌ Reply to a *view-once image or video* with .vv'
                });
                return;
            }

            // Get the actual media message
            let mediaMessage = null;
            let mediaType = null;

            // Handle all view-once formats
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

            if (!mediaMessage) {
                await conn.sendMessage(chatId, { 
                    text: '❌ No media found in the replied message.'
                });
                return;
            }

            // Check if it's actually view-once
            if (!mediaMessage.viewOnce) {
                await conn.sendMessage(chatId, { 
                    text: '❌ This is not a view-once message.'
                });
                return;
            }

            // Determine media type
            const isImage = !!mediaMessage.mimetype?.startsWith("image") || 
                           mediaMessage.jpeg || 
                           !!quoted.imageMessage;
            const isVideo = !!mediaMessage.mimetype?.startsWith("video") || 
                           !!quoted.videoMessage;

            const downloadType = isImage ? "image" : "video";

            // React to the command
            await conn.sendMessage(chatId, {
                react: { text: '👁️', key: mek.key }
            });

            // Send a quick confirmation to the chat
            await conn.sendMessage(chatId, {
                text: `✅ *View-once revealed!*\n\n📩 Check your DM for the media.\n\n_${settings.footer}_`
            });

            // Download media
            const stream = await downloadContentFromMessage(mediaMessage, downloadType);
            let buffer = Buffer.from([]);
            for await (const chunk of stream) {
                buffer = Buffer.concat([buffer, chunk]);
            }

            if (!buffer || buffer.length === 0) {
                throw new Error('Downloaded media is empty');
            }

            // Send to user's PRIVATE DM (not the current chat)
            const caption = `╔══════════════════════╗
║   👑 PRIVATE REVEAL   
╚══════════════════════╝

📱 *Revealed by:* QUEEN BELLA MD
🕐 *Time:* ${new Date().toLocaleString()}

${mediaMessage.caption ? `📝 *Original Caption:*\n${mediaMessage.caption}` : ''}

⚠️ *This media was view-once in the chat.*

${settings.footer}`;

            await conn.sendMessage(senderJid, {
                [downloadType]: buffer,
                caption: caption,
                contextInfo: {
                    forwardingScore: 999,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: settings.channelId || "120363423209691396@newsletter",
                        newsletterName: settings.channelName || "👑 QUEEN BELLA MD 👑",
                        serverMessageId: 1
                    }
                }
            });

            console.log(`✅ View-once revealed privately to ${senderNumber}`);

        } catch (error) {
            console.error('VV Error:', error);
            await conn.sendMessage(chatId, { 
                text: `❌ Failed to reveal: ${error.message}`
            });
        }
    }
};