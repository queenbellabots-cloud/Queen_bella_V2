/**
 * 👑 QUEEN BELLA MD - Group Status
 * Post status updates in groups (Admin only)
 */

const settings = require('../settings');
const { PassThrough } = require("stream");
const ffmpeg = require("fluent-ffmpeg");
const { downloadContentFromMessage } = require("@whiskeysockets/baileys");

const PURPLE_COLOR = "#9C27B0";

// Try to set ffmpeg path
try {
    const ffmpegInstaller = require("@ffmpeg-installer/ffmpeg");
    ffmpeg.setFfmpegPath(ffmpegInstaller.path);
} catch (error) {
    console.warn("[GroupStatus] ffmpeg binary setup warning:", error.message);
}

module.exports = {
    name: 'groupstatus',
    aliases: ['gcstatus', 'gstatus'],
    category: 'admin',
    description: 'Post a status in the group (Admin only)',
    usage: '.groupstatus [caption] or reply to media',
    react: '📣',
    async execute(conn, mek, args, chatId, isOwner) {
        try {
            const sender = mek.key.participant || mek.key.remoteJid;

            // Check if in group
            if (!chatId.endsWith('@g.us')) {
                await conn.sendMessage(chatId, {
                    react: { text: '❌', key: mek.key }
                });
                await conn.sendMessage(chatId, { 
                    text: '❌ This command can only be used in groups!'
                });
                return;
            }

            // Check if user is admin or owner
            const groupMeta = await conn.groupMetadata(chatId);
            const isAdmin = groupMeta.participants.find(p => 
                p.id === sender && p.admin !== null
            );

            // Check if bot is admin
            const botJid = conn.user.id;
            const isBotAdmin = groupMeta.participants.find(p => 
                p.id === botJid && p.admin !== null
            );

            if (!isAdmin && !isOwner) {
                await conn.sendMessage(chatId, {
                    react: { text: '⛔', key: mek.key }
                });
                await conn.sendMessage(chatId, { 
                    text: '⛔ Only group admins can post a group status!'
                });
                return;
            }

            if (!isBotAdmin) {
                await conn.sendMessage(chatId, {
                    react: { text: '❌', key: mek.key }
                });
                await conn.sendMessage(chatId, { 
                    text: '❌ Please make the bot an admin before posting a group status!'
                });
                return;
            }

            const caption = args.join(' ').trim();
            const quotedMessage = mek.message?.extendedTextMessage?.contextInfo?.quotedMessage ||
                                 mek.message?.imageMessage?.contextInfo?.quotedMessage ||
                                 mek.message?.videoMessage?.contextInfo?.quotedMessage;

            // If no quoted message
            if (!quotedMessage) {
                if (!caption) {
                    await conn.sendMessage(chatId, {
                        react: { text: 'ℹ️', key: mek.key }
                    });
                    await conn.sendMessage(chatId, { 
                        text: `📣 *Group Status Usage*

• Reply to an image, video, audio, or sticker:
  .groupstatus [optional caption]

• Post a text status:
  .groupstatus Your text here`
                    });
                    return;
                }

                // Post text status
                await conn.sendMessage(chatId, { 
                    text: '⏳ Posting text group status...' 
                });

                try {
                    await postGroupStatus(conn, chatId, {
                        text: caption,
                        backgroundColor: PURPLE_COLOR
                    });
                    await conn.sendMessage(chatId, { 
                        text: '✅ Text group story posted successfully!' 
                    });
                } catch (error) {
                    console.error('[GroupStatus] text error:', error);
                    await conn.sendMessage(chatId, { 
                        text: `❌ Failed to post text group story: ${error.message || error}`
                    });
                }
                return;
            }

            // Handle quoted media
            const mediaPayload = unwrapQuotedMessage(quotedMessage);
            const mediaType = detectMediaType(mediaPayload);
            
            if (!mediaType) {
                await conn.sendMessage(chatId, {
                    react: { text: '❌', key: mek.key }
                });
                await conn.sendMessage(chatId, { 
                    text: '❌ Unsupported media. Reply to an image, video, audio, or sticker.'
                });
                return;
            }

            await conn.sendMessage(chatId, { 
                text: `⏳ Preparing ${mediaType} group status...` 
            });

            try {
                const buffer = await downloadMedia(mediaPayload, mediaType);
                if (!buffer?.length) throw new Error("Media could not be downloaded.");

                if (mediaType === "audio") {
                    const voiceNote = await convertToVoiceNote(buffer);
                    await postGroupStatus(conn, chatId, {
                        audio: voiceNote,
                        mimetype: "audio/ogg; codecs=opus",
                        ptt: true
                    });
                } else if (mediaType === "sticker") {
                    await postGroupStatus(conn, chatId, {
                        sticker: buffer
                    });
                } else {
                    await postGroupStatus(conn, chatId, {
                        [mediaType]: buffer,
                        caption: caption || ''
                    });
                }

                await conn.sendMessage(chatId, { 
                    text: `✅ ${mediaType[0].toUpperCase() + mediaType.slice(1)} group story posted successfully!` 
                });

            } catch (error) {
                console.error(`[GroupStatus] ${mediaType} error:`, error);
                await conn.sendMessage(chatId, { 
                    text: `❌ Failed to post ${mediaType} group story: ${error.message || error}`
                });
            }

        } catch (error) {
            console.error('Error in groupstatus:', error);
            await conn.sendMessage(chatId, { 
                text: '❌ Error posting group status.'
            });
        }
    }
};

// Helper Functions
function detectMediaType(message) {
    if (!message || typeof message !== "object") return null;
    if (message.imageMessage) return "image";
    if (message.videoMessage) return "video";
    if (message.audioMessage) return "audio";
    if (message.stickerMessage) return "sticker";
    return null;
}

function unwrapQuotedMessage(message) {
    let current = message;
    for (let i = 0; i < 4; i++) {
        const wrapper = current?.viewOnceMessageV2 ||
                        current?.viewOnceMessage ||
                        current?.viewOnceMessageV2Extension ||
                        current?.documentWithCaptionMessage;
        if (!wrapper?.message) break;
        current = wrapper.message;
    }
    return current;
}

async function downloadMedia(message, type) {
    const mediaMessage = message[`${type}Message`];
    if (!mediaMessage) throw new Error(`Missing ${type} message payload.`);

    const stream = await downloadContentFromMessage(mediaMessage, type);
    const chunks = [];
    for await (const chunk of stream) chunks.push(chunk);
    return Buffer.concat(chunks);
}

async function postGroupStatus(client, jid, content) {
    const statusSourceType = content.text
        ? "TEXT"
        : content.image
            ? "IMAGE"
            : content.video
                ? "VIDEO"
                : content.audio
                    ? "AUDIO"
                    : content.sticker
                        ? "IMAGE"
                        : "TEXT";

    return client.sendMessage(jid, {
        ...content,
        contextInfo: {
            ...(content.contextInfo || {}),
            isGroupStatus: true,
            statusSourceType,
            statusAttributions: [{ type: 10 }],
            statusAudienceMetadata: { audienceType: "CLOSE_FRIENDS" }
        }
    });
}

function convertToVoiceNote(buffer) {
    return new Promise((resolve, reject) => {
        const input = new PassThrough();
        const output = new PassThrough();
        const chunks = [];
        input.end(buffer);

        output.on("data", (chunk) => chunks.push(chunk));
        ffmpeg(input)
            .noVideo()
            .audioCodec("libopus")
            .format("ogg")
            .audioChannels(1)
            .audioFrequency(48000)
            .on("error", reject)
            .on("end", () => resolve(Buffer.concat(chunks)))
            .pipe(output);
    });
}