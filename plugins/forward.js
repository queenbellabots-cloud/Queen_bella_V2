/**
 * 👑 QUEEN BELLA MD - Forward View-Once
 * Forward view-once media to any number using .ff
 */

const settings = require('../settings');
const { downloadContentFromMessage } = require('@whiskeysockets/baileys');

// ═══════════════════════════════════════════════════════
// 📥 EXTRACT VIEW-ONCE MEDIA
// ═══════════════════════════════════════════════════════
function extractMedia(quoted) {
    if (!quoted) return null;

    let inner = quoted;
    if (quoted.viewOnceMessageV2?.message) inner = quoted.viewOnceMessageV2.message;
    else if (quoted.viewOnceMessage?.message) inner = quoted.viewOnceMessage.message;
    else if (quoted.viewOnceMessageV2Extension?.message) inner = quoted.viewOnceMessageV2Extension.message;

    if (inner.imageMessage) {
        return { type: 'image', media: inner.imageMessage, caption: inner.imageMessage.caption || '' };
    }
    if (inner.videoMessage) {
        return { type: 'video', media: inner.videoMessage, caption: inner.videoMessage.caption || '' };
    }

    return null;
}

// ═══════════════════════════════════════════════════════
// 📥 DOWNLOAD MEDIA
// ═══════════════════════════════════════════════════════
async function downloadMedia(mediaInfo) {
    try {
        const stream = await downloadContentFromMessage(mediaInfo.media, mediaInfo.type);
        const chunks = [];
        for await (const chunk of stream) chunks.push(chunk);
        return Buffer.concat(chunks);
    } catch (error) {
        console.error(`❌ Download failed:`, error.message);
        return null;
    }
}

module.exports = {
    name: 'ff',
    aliases: ['forward', 'fwd', 'sendto'],
    category: 'tools',
    description: 'Forward view-once media to any number with country code',
    usage: '.ff +254712345678 (reply to view-once)',
    react: '📤',
    async execute(conn, mek, args, chatId, isOwner) {
        try {
            const sender = mek.key.participant || mek.key.remoteJid;

            // Check if replying to a message
            const quoted = mek.message?.extendedTextMessage?.contextInfo?.quotedMessage;

            if (!quoted) {
                await conn.sendMessage(chatId, {
                    text: `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   📤 FORWARD VIEW-ONCE       ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

❌ *Reply to a view-once image/video!*

📝 *Usage:*
.ff +<countrycode><number>

📌 *Examples:*
.ff +254712345678
.ff +12025551234
.ff +447911123456

💡 *Add caption after number:*
.ff +254712345678 Check this out!

${settings.footer}`
                });
                return;
            }

            if (!args.length) {
                await conn.sendMessage(chatId, {
                    text: `❌ *No number provided!*\n\nUsage: .ff +254712345678\nExample: .ff +254712345678`
                });
                return;
            }

            // Extract media
            const mediaInfo = extractMedia(quoted);
            if (!mediaInfo) {
                await conn.sendMessage(chatId, {
                    text: `❌ *No view-once media found!*\n\nMake sure you replied to a *view-once* image or video.`
                });
                return;
            }

            // Get target number — strips everything except digits
            let targetNumber = args[0].replace(/[^0-9]/g, '');

            if (!targetNumber || targetNumber.length < 10) {
                await conn.sendMessage(chatId, {
                    text: `❌ *Invalid number!*\n\nUse format: +<countrycode><number>\n\nExamples:\n.ff +254712345678 (Kenya)\n.ff +12025551234 (USA)\n.ff +447911123456 (UK)\n.ff +255712345678 (Tanzania)`
                });
                return;
            }

            // Custom caption (optional)
            const customCaption = args.slice(1).join(' ') || '';

            const targetJid = targetNumber + '@s.whatsapp.net';

            await conn.sendMessage(chatId, {
                react: { text: '📤', key: mek.key }
            });

            // Processing message
            await conn.sendMessage(chatId, {
                text: `📤 *Forwarding ${mediaInfo.type}...*\n\n🎯 To: +${targetNumber}\n⏳ Please wait...`
            });

            // Download media
            const buffer = await downloadMedia(mediaInfo);
            if (!buffer || buffer.length === 0) {
                throw new Error('Download failed');
            }

            // Build caption
            const caption = customCaption || mediaInfo.caption || `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   📤 FORWARDED MEDIA         ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

📱 *From:* +${sender.split('@')[0]}
🕐 *Time:* ${new Date().toLocaleString()}

${settings.footer}`;

            // Build content
            const content = {
                caption,
                contextInfo: {
                    forwardingScore: 999,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: settings.channelId || "120363411498601038@newsletter",
                        newsletterName: settings.channelName || "👑 QUEEN BELLA MD 👑",
                        serverMessageId: 1
                    }
                }
            };

            if (mediaInfo.type === 'image') {
                content.image = buffer;
            } else if (mediaInfo.type === 'video') {
                content.video = buffer;
            }

            // Forward to target
            await conn.sendMessage(targetJid, content);

            // Confirm in original chat
            await conn.sendMessage(chatId, {
                text: `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   ✅ FORWARDED!              ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

📤 *Media:* ${mediaInfo.type.toUpperCase()}
🎯 *Sent to:* +${targetNumber}
🕐 *Time:* ${new Date().toLocaleString()}

${customCaption ? `📝 *Caption:* ${customCaption}` : ''}

${settings.footer}`,
                contextInfo: { mentionedJid: [sender] }
            });

            console.log(`✅ View-once forwarded to +${targetNumber}`);

        } catch (error) {
            console.error('Forward error:', error);
            await conn.sendMessage(chatId, {
                react: { text: '❌', key: mek.key }
            });
            await conn.sendMessage(chatId, {
                text: `❌ *Failed to forward!*\n\nError: ${error.message}`
            });
        }
    }
};