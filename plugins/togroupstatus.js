/**
 * 👑 QUEEN BELLA MD - Send to Group Status
 * Send text or quoted media to group status (without ffmpeg)
 */

const settings = require('../settings');
const { downloadContentFromMessage } = require('@whiskeysockets/baileys');
const fs = require('fs');
const path = require('path');
const os = require('os');

// Different reaction emojis
const STATUS_REACTIONS = ['📢', '📣', '🔊', '📨', '📤', '✅', '✨', '📡'];

module.exports = {
    name: 'togroupstatus',
    aliases: ['groupstatus', 'statusgroup', 'togcstatus', 'gstatus'],
    category: 'group',
    description: 'Send text or quoted media to group status',
    usage: '.togroupstatus <text> or reply to media',
    react: '📢',
    async execute(conn, mek, args, chatId, isOwner) {
        try {
            // 👇 REACT WITH RANDOM EMOJI
            const randomReact = STATUS_REACTIONS[Math.floor(Math.random() * STATUS_REACTIONS.length)];
            await conn.sendMessage(chatId, {
                react: { text: randomReact, key: mek.key }
            });

            // Check if in a group
            const isGroup = chatId.endsWith('@g.us');
            if (!isGroup) {
                await conn.sendMessage(chatId, {
                    text: '❌ This command can only be used in a group!'
                });
                return;
            }

            // ✅ REMOVED OWNER CHECK - EVERYONE CAN USE!

            // Get quoted message
            const quoted = mek.message?.extendedTextMessage?.contextInfo?.quotedMessage;
            const hasQuoted = !!quoted;
            
            // Get text
            const q = args.join(' ').trim();

            if (!q && !hasQuoted) {
                await conn.sendMessage(chatId, {
                    text: `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   👑 QUEEN BELLA MD V1   ┃
┃   Created by Dev RODGERS  ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

📌 *USAGE:*

• .togroupstatus <text>
• Reply to image/video/audio with .togroupstatus <caption>
• Or just .togroupstatus to forward quoted media

${settings.footer}`
                });
                return;
            }

            try {
                let statusPayload = {};

                if (hasQuoted) {
                    // Handle image
                    if (quoted.imageMessage) {
                        const caption = q || quoted.imageMessage.caption || '';
                        const buffer = await downloadMedia(quoted.imageMessage, 'image');
                        statusPayload = { 
                            image: buffer, 
                            mimetype: 'image/jpeg' 
                        };
                        if (caption) statusPayload.caption = caption;
                    }
                    // Handle video
                    else if (quoted.videoMessage) {
                        const caption = q || quoted.videoMessage.caption || '';
                        const buffer = await downloadMedia(quoted.videoMessage, 'video');
                        statusPayload = { 
                            video: buffer, 
                            mimetype: 'video/mp4' 
                        };
                        if (caption) statusPayload.caption = caption;
                    }
                    // Handle audio
                    else if (quoted.audioMessage) {
                        const buffer = await downloadMedia(quoted.audioMessage, 'audio');
                        statusPayload = { 
                            audio: buffer, 
                            mimetype: 'audio/mpeg', 
                            ptt: true 
                        };
                    }
                    // Handle text
                    else if (quoted.conversation || quoted.extendedTextMessage?.text) {
                        statusPayload.text = quoted.conversation || quoted.extendedTextMessage.text;
                    }
                    // Unsupported
                    else {
                        await conn.sendMessage(chatId, {
                            text: '❌ Unsupported media type for group status.'
                        });
                        return;
                    }

                    // Add caption if provided
                    if (q && !statusPayload.caption && !statusPayload.text) {
                        statusPayload.caption = q;
                    }
                } else {
                    statusPayload.text = q;
                }

                // Send as status to group
                await conn.sendMessage('status@broadcast', statusPayload, {
                    statusJidList: [chatId]
                });

                // 👇 REACT WITH SUCCESS
                await conn.sendMessage(chatId, {
                    react: { text: '✅', key: mek.key }
                });

                await conn.sendMessage(chatId, {
                    text: `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   👑 QUEEN BELLA MD V1   ┃
┃   Created by Dev RODGERS  ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

📢 *GROUP STATUS SENT!*

✅ Status has been sent to the group.

${settings.footer}`
                });

            } catch (error) {
                console.error('togroupstatus error:', error);
                await conn.sendMessage(chatId, {
                    react: { text: '❌', key: mek.key }
                });
                await conn.sendMessage(chatId, {
                    text: `❌ Error sending group status: ${error.message}`
                });
            }

        } catch (error) {
            console.error('Error in togroupstatus:', error);
            await conn.sendMessage(chatId, {
                react: { text: '❌', key: mek.key }
            });
            await conn.sendMessage(chatId, {
                text: '❌ Error in togroupstatus command.'
            });
        }
    }
};

// Helper: download media from message
async function downloadMedia(message, type) {
    try {
        const stream = await downloadContentFromMessage(message, type);
        let buffer = Buffer.from([]);
        for await (const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk]);
        }
        return buffer;
    } catch (error) {
        console.error('Download error:', error);
        throw error;
    }
}