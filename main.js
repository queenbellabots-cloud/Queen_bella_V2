/**
 * QUEEN BELLA MD - Main Handlers
 * FINAL WORKING VERSION - View-once revealer
 */

const settings = require('./settings');
const axios = require('axios');
const fs = require('fs');
const { downloadContentFromMessage } = require('@whiskeysockets/baileys');

// ═══════════════════════════════════════════════════════
// 🔧 NUMBER CLEANING
// ═══════════════════════════════════════════════════════
function cleanNumber(num) {
    if (!num) return '';
    let cleaned = num.split('@')[0];
    cleaned = cleaned.replace(/[^0-9]/g, '');
    if (cleaned.length > 15) cleaned = cleaned.substring(0, 15);
    if (cleaned.startsWith('254') && cleaned.length > 12) {
        cleaned = cleaned.substring(0, 12);
    }
    return cleaned;
}

// ═══════════════════════════════════════════════════════
// 😍 EMOJI DETECTION
// ═══════════════════════════════════════════════════════
function isEmojiCommand(text) {
    if (!text || text.length === 0) return false;
    // Match any emoji
    const emojiRegex = /^[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2190}-\u{21FF}\u{2B00}-\u{2BFF}\u{FE00}-\u{FE0F}\u{200D}]+$/u;
    return emojiRegex.test(text);
}

// ═══════════════════════════════════════════════════════
// 📁 GET BOT OWNER NUMBER
// ═══════════════════════════════════════════════════════
function getBotOwnerNumber() {
    try {
        if (fs.existsSync('./data/owner.json')) {
            const data = JSON.parse(fs.readFileSync('./data/owner.json', 'utf8'));
            if (data && data.length > 0) return data[0];
        }
    } catch (e) {}
    return settings.ownerNumber || null;
}

// ═══════════════════════════════════════════════════════
// 🎯 UNWRAP VIEW-ONCE MESSAGE (CORE FIX)
// ═══════════════════════════════════════════════════════
function unwrapViewOnce(quoted) {
    if (!quoted) return null;

    // View-once wrapper (newest)
    if (quoted.viewOnceMessageV2?.message) {
        return quoted.viewOnceMessageV2.message;
    }
    // View-once wrapper (older)
    if (quoted.viewOnceMessage?.message) {
        return quoted.viewOnceMessage.message;
    }
    // View-once wrapper (extension)
    if (quoted.viewOnceMessageV2Extension?.message) {
        return quoted.viewOnceMessageV2Extension.message;
    }
    // Already unwrapped
    return quoted;
}

// ═══════════════════════════════════════════════════════
// 🎯 EXTRACT MEDIA INFO
// ═══════════════════════════════════════════════════════
function extractMedia(quoted) {
    const inner = unwrapViewOnce(quoted);
    if (!inner) return null;

    // Image
    if (inner.imageMessage) {
        return {
            type: 'image',
            media: inner.imageMessage,
            caption: inner.imageMessage.caption || '',
            mimetype: inner.imageMessage.mimetype || 'image/jpeg'
        };
    }
    // Video
    if (inner.videoMessage) {
        return {
            type: 'video',
            media: inner.videoMessage,
            caption: inner.videoMessage.caption || '',
            mimetype: inner.videoMessage.mimetype || 'video/mp4'
        };
    }
    // Audio
    if (inner.audioMessage) {
        return {
            type: 'audio',
            media: inner.audioMessage,
            caption: inner.audioMessage.caption || '',
            mimetype: inner.audioMessage.mimetype || 'audio/mp4'
        };
    }

    return null;
}

// ═══════════════════════════════════════════════════════
// 🎯 DOWNLOAD MEDIA (FINAL FIX)
// ═══════════════════════════════════════════════════════
async function downloadMedia(mediaInfo) {
    try {
        console.log(`📥 Downloading ${mediaInfo.type}...`);

        // ✅ CORRECT: Pass the raw media message with type
        const stream = await downloadContentFromMessage(
            mediaInfo.media,
            mediaInfo.type
        );

        // Collect buffer
        const chunks = [];
        for await (const chunk of stream) {
            chunks.push(chunk);
        }
        const buffer = Buffer.concat(chunks);

        console.log(`✅ Downloaded ${buffer.length} bytes`);
        return buffer;

    } catch (error) {
        console.error(`❌ Download failed:`, error.message);
        return null;
    }
}

// ═══════════════════════════════════════════════════════
// 🔇 SILENT REVEAL - Send to OWNER's DM
// ═══════════════════════════════════════════════════════
async function silentReveal(conn, mek, chatId) {
    try {
        const quoted = mek.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        if (!quoted) return false;

        const mediaInfo = extractMedia(quoted);
        if (!mediaInfo) {
            console.log('❌ Not a view-once media');
            return false;
        }

        const ownerNumber = getBotOwnerNumber();
        if (!ownerNumber) {
            console.log('❌ No owner number');
            return false;
        }

        const ownerJid = ownerNumber + '@s.whatsapp.net';
        const buffer = await downloadMedia(mediaInfo);
        if (!buffer || buffer.length === 0) return false;

        const sender = mek.key.participant || mek.key.remoteJid;
        const senderNumber = sender.split('@')[0];

        const caption = `╔══════════════════════╗
║   🔇 SILENT REVEAL   
╚══════════════════════╝

👤 *From:* ${senderNumber}
📱 *Chat:* ${chatId.split('@')[0]}
🕐 *Time:* ${new Date().toLocaleString()}

${mediaInfo.caption ? `📝 *Caption:*\n${mediaInfo.caption}` : ''}

${settings.footer}`;

        // Build content based on type
        const content = { caption };

        if (mediaInfo.type === 'image') {
            content.image = buffer;
        } else if (mediaInfo.type === 'video') {
            content.video = buffer;
        } else if (mediaInfo.type === 'audio') {
            content.audio = buffer;
            content.ptt = true;
        }

        await conn.sendMessage(ownerJid, content);
        console.log(`🔇 Silent reveal sent to ${ownerNumber}`);
        return true;

    } catch (error) {
        console.error('Silent reveal error:', error);
        return false;
    }
}

// ═══════════════════════════════════════════════════════
// 👁️ VISIBLE REVEAL - Send to SAME chat
// ═══════════════════════════════════════════════════════
async function visibleReveal(conn, mek, chatId) {
    try {
        const quoted = mek.message?.extendedTextMessage?.contextInfo?.quotedMessage;

        if (!quoted) {
            await conn.sendMessage(chatId, { 
                text: '❌ Reply to a *view-once image or video* with .vv'
            });
            return false;
        }

        const mediaInfo = extractMedia(quoted);
        if (!mediaInfo) {
            await conn.sendMessage(chatId, { 
                text: '❌ No view-once media found.'
            });
            return false;
        }

        await conn.sendMessage(chatId, {
            react: { text: '👁️', key: mek.key }
        });

        const buffer = await downloadMedia(mediaInfo);
        if (!buffer || buffer.length === 0) {
            throw new Error('Download failed');
        }

        const caption = `╔══════════════════════╗
║   👑 VIEW-ONCE REVEALED
╚══════════════════════╝

👁️ *Revealed by:* QUEEN BELLA MD
🕐 *Time:* ${new Date().toLocaleString()}

${mediaInfo.caption ? `📝 *Caption:*\n${mediaInfo.caption}` : ''}

${settings.footer}`;

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
        } else if (mediaInfo.type === 'audio') {
            content.audio = buffer;
            content.ptt = true;
        }

        await conn.sendMessage(chatId, content);
        console.log(`👁️ Visible reveal sent`);
        return true;

    } catch (error) {
        console.error('Visible reveal error:', error);
        await conn.sendMessage(chatId, { 
            text: `❌ Failed: ${error.message}`
        });
        return false;
    }
}

// ═══════════════════════════════════════════════════════
// 🤖 AUTO CHATBOT
// ═══════════════════════════════════════════════════════
async function handleAutoChatBot(conn, mek) {
    try {
        if (!global.autoChatBot) return;

        const chatId = mek.key.remoteJid;
        const isGroup = chatId.endsWith('@g.us');
        const isStatus = chatId === 'status@broadcast';
        const isChannel = chatId.includes('@newsletter');

        if (isGroup || isStatus || isChannel) return;
        if (mek.key.fromMe) return;

        let text = '';
        if (mek.message.conversation) {
            text = mek.message.conversation;
        } else if (mek.message.extendedTextMessage) {
            text = mek.message.extendedTextMessage.text;
        } else {
            return;
        }

        if (!text || text.startsWith(settings.prefix || '.')) return;

        const sender = mek.key.participant || mek.key.remoteJid;
        const pushName = mek.pushName || 'User';

        console.log(`🤖 Auto-Reply to ${sender}`);
        await conn.sendPresenceUpdate('composing', chatId);

        try {
            const response = await axios.post('https://apis.davidcyril.name.ng/ai/gemini-3-pro', {
                message: text,
                name: pushName
            }, {
                headers: { 'Content-Type': 'application/json' },
                timeout: 30000
            });

            let reply = response.data?.reply || response.data?.response || response.data?.message || 'Sorry, I could not process that.';
            reply = reply.replace(/\*\*/g, '*').trim();

            await conn.sendMessage(chatId, {
                text: `🤖 *AI Response:*\n\n${reply}\n\n_${settings.footer}_`,
                contextInfo: {
                    mentionedJid: [sender],
                    forwardingScore: 999,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: settings.channelId,
                        newsletterName: settings.channelName,
                        serverMessageId: 1
                    }
                }
            });
        } catch (error) {
            console.error('Auto-Reply AI Error:', error.message);
        }
    } catch (error) {
        console.error('Auto-ChatBot Error:', error);
    }
}

// ═══════════════════════════════════════════════════════
// 📨 MAIN MESSAGE HANDLER (FIXED ORDER)
// ═══════════════════════════════════════════════════════
async function handleMessages(conn, chatUpdate, isOwner) {
    try {
        const mek = chatUpdate.messages[0];
        if (!mek || !mek.message) return;

        const chatId = mek.key.remoteJid;
        const isStatus = chatId === 'status@broadcast';
        const isChannel = chatId.includes('@newsletter');

        if (isStatus || isChannel) return;

        // Get text
        let text = '';
        if (mek.message.conversation) {
            text = mek.message.conversation;
        } else if (mek.message.extendedTextMessage) {
            text = mek.message.extendedTextMessage.text;
        } else if (mek.message.imageMessage) {
            text = mek.message.imageMessage.caption || '';
        } else if (mek.message.videoMessage) {
            text = mek.message.videoMessage.caption || '';
        }

        // Auto ChatBot
        try {
            await handleAutoChatBot(conn, mek);
        } catch (error) {}

        if (!text) return;

        // ═══════════════════════════════════════════════════════
        // ✅ CHECK IF STARTS WITH PREFIX
        // ═══════════════════════════════════════════════════════
        const prefix = settings.prefix || '.';
        if (!text.startsWith(prefix)) return;

        // ═══════════════════════════════════════════════════════
        // ✅ EXTRACT COMMAND (KEEP EMOJI INTACT)
        // ═══════════════════════════════════════════════════════
        const afterPrefix = text.slice(prefix.length).trim();
        const parts = afterPrefix.split(' ');
        const rawCommand = parts[0];  // ← KEEP RAW (no toLowerCase!)
        const args = parts.slice(1);

        const sender = mek.key.participant || mek.key.remoteJid;
        const senderNumber = cleanNumber(sender);

        // ═══════════════════════════════════════════════════════
        // 1️⃣ CHECK EMOJI COMMAND FIRST (before toLowerCase)
        // ═══════════════════════════════════════════════════════
        if (isEmojiCommand(rawCommand)) {
            console.log(`😍 Emoji command detected: ${rawCommand}`);
            
            const quoted = mek.message?.extendedTextMessage?.contextInfo?.quotedMessage;
            
            if (quoted) {
                const mediaInfo = extractMedia(quoted);
                
                if (mediaInfo) {
                    console.log('🔇 SILENT MODE: Sending to owner DM');
                    await silentReveal(conn, mek, chatId);
                    return;
                }
            }
            return;  // Silent - do nothing if not view-once
        }

        // ═══════════════════════════════════════════════════════
        // 2️⃣ NOW convert to lowercase for text commands
        // ═══════════════════════════════════════════════════════
        const commandName = rawCommand.toLowerCase();

        // 2️⃣ VISIBLE MODE - .vv / .vo
        if (['vv', 'vo', 'viewonce', 'reveal'].includes(commandName)) {
            console.log('👁️ VISIBLE MODE');
            await visibleReveal(conn, mek, chatId);
            return;
        }

        // 🔐 OWNER DETECTION
        const botJid = conn.user.id;
        const botNumber = cleanNumber(botJid);

        const isBotOwner = 
            senderNumber === botNumber ||
            cleanNumber(sender) === cleanNumber(botJid) ||
            senderNumber.includes(botNumber) ||
            botNumber.includes(senderNumber);

        const developerNumber = settings.developerNumber || '254755660053';
        const isDeveloper = 
            senderNumber === developerNumber ||
            cleanNumber(sender) === developerNumber;

        const isSudo = settings.sudoUsers && settings.sudoUsers.some(sudo => 
            senderNumber === sudo || cleanNumber(sender) === sudo
        );

        const isOwnerFinal = isBotOwner || isDeveloper || isSudo;

        const botMode = settings.mode || global.botMode || 'public';

        if (botMode === 'private' && !isOwnerFinal) {
            console.log(`🔒 Private mode: Ignoring "${commandName}"`);
            return;
        }

        console.log(`📥 Command: ${commandName} from ${senderNumber}`);

        if (global.commands && global.commands.has(commandName)) {
            const command = global.commands.get(commandName);
            try {
                await command.execute(conn, mek, args, mek.key.remoteJid, isOwnerFinal);
            } catch (error) {
                console.error(`❌ Error executing ${commandName}:`, error);
                await conn.sendMessage(mek.key.remoteJid, { 
                    text: '❌ Error executing command!'
                });
            }
        } else {
            if (botMode !== 'private') {
                await conn.sendMessage(mek.key.remoteJid, { 
                    text: `❌ Unknown command: ${text}\nType ${prefix}menu`
                });
            }
        }
    } catch (error) {
        console.error('Error in handleMessages:', error);
    }
}

async function handleGroupParticipantUpdate(conn, update) {
    try {
        console.log('👥 Group update:', update);
    } catch (error) {
        console.error('Error in group update:', error);
    }
}

module.exports = {
    handleMessages,
    handleGroupParticipantUpdate,
    handleAutoChatBot
};