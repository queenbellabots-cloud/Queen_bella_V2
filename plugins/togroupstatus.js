/**
 * 👑 QUEEN BELLA MD - Send to Group Status
 * Send text or quoted media to group status
 */

const settings = require('../settings');
const { downloadContentFromMessage } = require('@whiskeysockets/baileys');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const path = require('path');
const os = require('os');

// Different reaction emojis
const STATUS_REACTIONS = ['📢', '📣', '🔊', '📨', '📤', '✅', '✨', '📡'];

// Helper: format video buffer to mp4 using ffmpeg
const formatVideo = (buffer) => new Promise((resolve, reject) => {
    const tmpIn = path.join(os.tmpdir(), `vin_${Date.now()}.mp4`);
    const tmpOut = path.join(os.tmpdir(), `vout_${Date.now()}.mp4`);
    fs.writeFileSync(tmpIn, buffer);
    ffmpeg(tmpIn)
        .outputOptions(['-c:v libx264', '-c:a aac', '-movflags +faststart'])
        .save(tmpOut)
        .on('end', () => {
            resolve(fs.readFileSync(tmpOut));
            try { fs.unlinkSync(tmpIn); fs.unlinkSync(tmpOut); } catch (e) {}
        })
        .on('error', (err) => {
            reject(err);
            try { fs.unlinkSync(tmpIn); } catch (e) {}
        });
});

// Helper: format audio buffer to mp4/aac using ffmpeg
const formatAudio = (buffer) => new Promise((resolve, reject) => {
    const tmpIn = path.join(os.tmpdir(), `ain_${Date.now()}.ogg`);
    const tmpOut = path.join(os.tmpdir(), `aout_${Date.now()}.mp4`);
    fs.writeFileSync(tmpIn, buffer);
    ffmpeg(tmpIn)
        .outputOptions(['-c:a aac'])
        .save(tmpOut)
        .on('end', () => {
            resolve(fs.readFileSync(tmpOut));
            try { fs.unlinkSync(tmpIn); fs.unlinkSync(tmpOut); } catch (e) {}
        })
        .on('error', (err) => {
            reject(err);
            try { fs.unlinkSync(tmpIn); } catch (e) {}
        });
});

// Helper: download media from message
const downloadMedia = async (message, type) => {
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
};

module.exports = {
    name: 'togroupstatus',
    aliases: ['groupstatus', 'statusgroup', 'togcstatus', 'gstatus'],
    category: 'group',
    description: 'Send text or quoted media to group status. Owner only.',
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

            // Check if owner
            if (!isOwner) {
                await conn.sendMessage(chatId, {
                    text: '❌ Owner Only Command!'
                });
                return;
            }

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
                        let buffer = await downloadMedia(quoted.videoMessage, 'video');
                        buffer = await formatVideo(buffer);
                        statusPayload = { 
                            video: buffer, 
                            mimetype: 'video/mp4' 
                        };
                        if (caption) statusPayload.caption = caption;
                    }
                    // Handle audio
                    else if (quoted.audioMessage) {
                        let buffer = await downloadMedia(quoted.audioMessage, 'audio');
                        buffer = await formatAudio(buffer);
                        statusPayload = { 
                            audio: buffer, 
                            mimetype: 'audio/mp4', 
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