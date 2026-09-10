/**
 * 👑 QUEEN BELLA MD - Save Status Command
 * Saves quoted status image or video to the chat
 */

const settings = require('../settings');
const { downloadContentFromMessage } = require('@whiskeysockets/baileys');

// Different reaction emojis for save
const SAVE_REACTIONS = ['📥', '💾', '📁', '✅', '✨', '📦', '💿', '🖼️'];

module.exports = {
    name: 'save',
    aliases: ['savestatus', 'dlstatus', 'downloadstatus'],
    category: 'tools',
    description: 'Save a status image or video to your chat',
    usage: '.save (reply to a status)',
    react: '📥',
    async execute(conn, mek, args, chatId, isOwner) {
        try {
            // 👇 REACT WITH RANDOM EMOJI
            const randomReact = SAVE_REACTIONS[Math.floor(Math.random() * SAVE_REACTIONS.length)];
            await conn.sendMessage(chatId, {
                react: { text: randomReact, key: mek.key }
            });

            const sender = mek.key.participant || mek.key.remoteJid;

            // Get quoted message
            let quoted = null;
            
            // Check if replying to a message
            if (mek.message?.extendedTextMessage?.contextInfo?.quotedMessage) {
                quoted = mek.message.extendedTextMessage.contextInfo.quotedMessage;
            }

            if (!quoted) {
                await conn.sendMessage(chatId, {
                    text: `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   👑 QUEEN BELLA MD V1   ┃
┃   Created by Dev RODGERS  ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

❌ *Please reply to a status image or video with .save*

📋 *Example:* Reply to a status with .save

${settings.footer}`
                });
                return;
            }

            // Check if it's an image or video
            const isImage = !!quoted.imageMessage;
            const isVideo = !!quoted.videoMessage;

            if (!isImage && !isVideo) {
                await conn.sendMessage(chatId, {
                    text: '❌ *Please reply to an Image or Video status.*'
                });
                return;
            }

            // Get the media message
            const mediaMessage = isImage ? quoted.imageMessage : quoted.videoMessage;
            const messageType = isImage ? 'image' : 'video';
            const caption = mediaMessage.caption || '';

            // Download the media
            try {
                const stream = await downloadContentFromMessage(mediaMessage, messageType);
                let mediaBuffer = Buffer.from([]);
                for await (const chunk of stream) {
                    mediaBuffer = Buffer.concat([mediaBuffer, chunk]);
                }

                // Get sender name
                const senderName = await conn.getName(sender) || sender.split('@')[0];

                // Build caption
                const saveCaption = `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   👑 QUEEN BELLA MD V1   ┃
┃   Created by Dev RODGERS  ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

📥 *STATUS SAVED!*

👤 *Saved by:* ${senderName}
📱 *Number:* ${sender.split('@')[0]}
🕒 *Time:* ${new Date().toLocaleString()}

${caption ? `📝 *Caption:* ${caption}\n` : ''}
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  📢 JOIN OUR CHANNEL         ┃
┃  👇 Click the button below    ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

${settings.footer}`;

                // Send the media
                if (isImage) {
                    await conn.sendMessage(chatId, {
                        image: mediaBuffer,
                        caption: saveCaption,
                        contextInfo: {
                            mentionedJid: [sender],
                            forwardingScore: 999,
                            isForwarded: true,
                            forwardedNewsletterMessageInfo: {
                                newsletterJid: settings.channelId || '120363411498601038@newsletter',
                                newsletterName: settings.channelName || 'QUEEN BELLA MD',
                                serverMessageId: 1
                            }
                        }
                    });
                } else {
                    await conn.sendMessage(chatId, {
                        video: mediaBuffer,
                        caption: saveCaption,
                        contextInfo: {
                            mentionedJid: [sender],
                            forwardingScore: 999,
                            isForwarded: true,
                            forwardedNewsletterMessageInfo: {
                                newsletterJid: settings.channelId || '120363411498601038@newsletter',
                                newsletterName: settings.channelName || 'QUEEN BELLA MD',
                                serverMessageId: 1
                            }
                        }
                    });
                }

                // 👇 REACT WITH SUCCESS
                await conn.sendMessage(chatId, {
                    react: { text: '✅', key: mek.key }
                });

            } catch (downloadError) {
                console.error('Download error:', downloadError);
                await conn.sendMessage(chatId, {
                    text: '❌ *Failed to download status.*'
                });
            }

        } catch (error) {
            console.error('Error in save command:', error);
            await conn.sendMessage(chatId, {
                react: { text: '❌', key: mek.key }
            });
            await conn.sendMessage(chatId, {
                text: '❌ Error in save command.'
            });
        }
    }
};