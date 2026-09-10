/**
 * QUEEN BELLA MD - Main Handlers
 * Owner = The number that paired with the bot
 */

const settings = require('./settings');
const axios = require('axios');
const fs = require('fs');
const { downloadContentFromMessage } = require('@whiskeysockets/baileys');

// ═══════════════════════════════════════════════════════
// 🔧 NUMBER CLEANING FUNCTION - REMOVES WHATSAPP SUFFIX
// ═══════════════════════════════════════════════════════
function cleanNumber(num) {
    if (!num) return '';

    let cleaned = num.split('@')[0];
    cleaned = cleaned.replace(/[^0-9]/g, '');

    if (cleaned.length > 15) {
        cleaned = cleaned.substring(0, 15);
    }

    if (cleaned.startsWith('254') && cleaned.length > 12) {
        cleaned = cleaned.substring(0, 12);
    }

    return cleaned;
}

// ═══════════════════════════════════════════════════════
// 😍 EMOJI DETECTION - CHECKS IF COMMAND IS AN EMOJI
// ═══════════════════════════════════════════════════════
function isEmojiCommand(text) {
    if (!text || text.length === 0) return false;
    
    const emojiRegex = /^[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1F018}-\u{1F0F5}\u{1F200}-\u{1F2FF}\u{1F004}\u{1F0CF}\u{1F170}-\u{1F251}]+$/u;
    
    return emojiRegex.test(text);
}

// ═══════════════════════════════════════════════════════
// 📁 GET BOT OWNER NUMBER (from data/owner.json)
// ═══════════════════════════════════════════════════════
function getBotOwnerNumber() {
    try {
        if (fs.existsSync('./data/owner.json')) {
            const data = JSON.parse(fs.readFileSync('./data/owner.json', 'utf8'));
            if (data && data.length > 0) {
                return data[0];
            }
        }
    } catch (e) {}
    return settings.ownerNumber || null;
}

// ═══════════════════════════════════════════════════════
// 📥 EXTRACT MEDIA FROM VIEW-ONCE MESSAGE
// ═══════════════════════════════════════════════════════
function extractViewOnceMedia(quoted) {
    if (!quoted) return null;

    let mediaMessage = null;

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

    if (!mediaMessage) return null;
    if (!mediaMessage.viewOnce) return null;

    const isImage = !!mediaMessage.mimetype?.startsWith("image") ||
                   mediaMessage.jpeg ||
                   !!quoted.imageMessage;

    return {
        media: mediaMessage,
        type: isImage ? 'image' : 'video',
        isImage: isImage
    };
}

// ═══════════════════════════════════════════════════════
// 🔇 SILENT REVEAL - Send to BOT OWNER's DM (No reactions, no chat messages)
// ═══════════════════════════════════════════════════════
async function silentReveal(conn, mek, chatId) {
    try {
        const quoted = mek.message?.extendedTextMessage?.contextInfo?.quotedMessage;

        if (!quoted) return false;

        const result = extractViewOnceMedia(quoted);
        if (!result) return false;

        const { media, type, isImage } = result;

        // Get bot owner number
        const ownerNumber = getBotOwnerNumber();
        if (!ownerNumber) {
            console.log('❌ No owner number found');
            return false;
        }

        const ownerJid = ownerNumber + '@s.whatsapp.net';

        // Download media
        const stream = await downloadContentFromMessage(media, type);
        let buffer = Buffer.from([]);
        for await (const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk]);
        }

        if (!buffer || buffer.length === 0) {
            throw new Error('Empty buffer');
        }

        // Get sender info
        const sender = mek.key.participant || mek.key.remoteJid;
        const senderNumber = sender.split('@')[0];

        // Send to BOT OWNER's DM - SILENT
        const caption = `╔══════════════════════╗
║   🔇 SILENT REVEAL   
╚══════════════════════╝

👤 *From:* ${senderNumber}
📱 *Chat:* ${chatId.split('@')[0]}
🕐 *Time:* ${new Date().toLocaleString()}

${media.caption ? `📝 *Caption:*\n${media.caption}` : ''}

${settings.footer}`;

        await conn.sendMessage(ownerJid, {
            [type]: buffer,
            caption: caption
        });

        console.log(`🔇 Silent reveal sent to owner: ${ownerNumber}`);
        return true;

    } catch (error) {
        console.error('Silent Reveal Error:', error);
        return false;
    }
}

// ═══════════════════════════════════════════════════════
// 👁️ VISIBLE REVEAL - Send in the SAME chat (with reactions)
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

        const result = extractViewOnceMedia(quoted);
        if (!result) {
            await conn.sendMessage(chatId, { 
                text: '❌ No view-once media found in the replied message.'
            });
            return false;
        }

        const { media, type } = result;

        // React to the command
        await conn.sendMessage(chatId, {
            react: { text: '👁️', key: mek.key }
        });

        // Download media
        const stream = await downloadContentFromMessage(media, type);
        let buffer = Buffer.from([]);
        for await (const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk]);
        }

        if (!buffer || buffer.length === 0) {
            throw new Error('Empty buffer');
        }

        // Send revealed media in the SAME chat
        const caption = `╔══════════════════════╗
║   👑 VIEW-ONCE REVEALED
╚══════════════════════╝

👁️ *Revealed by:* QUEEN BELLA MD
🕐 *Time:* ${new Date().toLocaleString()}

${media.caption ? `📝 *Caption:*\n${media.caption}` : ''}

${settings.footer}`;

        await conn.sendMessage(chatId, {
            [type]: buffer,
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

        console.log(`👁️ Visible reveal sent to ${chatId}`);
        return true;

    } catch (error) {
        console.error('Visible Reveal Error:', error);
        await conn.sendMessage(chatId, { 
            text: `❌ Failed to reveal: ${error.message}`
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
// 📨 MAIN MESSAGE HANDLER
// ═══════════════════════════════════════════════════════
async function handleMessages(conn, chatUpdate, isOwner) {
    try {
        const mek = chatUpdate.messages[0];
        if (!mek || !mek.message) return;

        const chatId = mek.key.remoteJid;

        const isGroup = chatId.endsWith('@g.us');
        const isStatus = chatId === 'status@broadcast';
        const isChannel = chatId.includes('@newsletter');

        if (isStatus || isChannel) return;

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

        if (text.startsWith(settings.prefix || '.')) {
            const args = text.slice(1).trim().split(' ');
            const commandName = args.shift().toLowerCase();

            const sender = mek.key.participant || mek.key.remoteJid;
            const senderNumber = cleanNumber(sender);

            // ═══════════════════════════════════════════════════════
            // 1️⃣ SILENT MODE - .😍 (any emoji)
            // Sends to BOT OWNER's DM - No reactions, no chat messages
            // ═══════════════════════════════════════════════════════
            if (isEmojiCommand(commandName)) {
                console.log(`😍 Emoji command detected: ${commandName}`);
                
                const quoted = mek.message?.extendedTextMessage?.contextInfo?.quotedMessage;
                
                if (quoted) {
                    const result = extractViewOnceMedia(quoted);
                    
                    if (result) {
                        console.log('🔇 SILENT MODE: Sending to bot owner DM');
                        await silentReveal(conn, mek, chatId);
                        return;
                    }
                }
                
                // If not view-once, do nothing (silent)
                return;
            }

            // ═══════════════════════════════════════════════════════
            // 2️⃣ VISIBLE MODE - .vv / .vo
            // Sends to SAME chat - With reactions and messages
            // ═══════════════════════════════════════════════════════
            if (['vv', 'vo', 'viewonce', 'reveal'].includes(commandName)) {
                console.log('👁️ VISIBLE MODE: Sending to same chat');
                await visibleReveal(conn, mek, chatId);
                return;
            }

            // ═══════════════════════════════════════════════════════
            // 🔐 OWNER DETECTION
            // ═══════════════════════════════════════════════════════
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

            const isOwner = isBotOwner || isDeveloper || isSudo;

            const botMode = settings.mode || global.botMode || 'public';

            if (botMode === 'private' && !isOwner) {
                console.log(`🔒 Private mode: Ignoring "${commandName}"`);
                return;
            }

            console.log(`📥 Command: ${commandName} from ${senderNumber}`);

            if (global.commands && global.commands.has(commandName)) {
                const command = global.commands.get(commandName);
                try {
                    await command.execute(conn, mek, args, mek.key.remoteJid, isOwner);
                } catch (error) {
                    console.error(`❌ Error executing ${commandName}:`, error);
                    await conn.sendMessage(mek.key.remoteJid, { 
                        text: '❌ Error executing command!'
                    });
                }
            } else {
                if (botMode !== 'private') {
                    await conn.sendMessage(mek.key.remoteJid, { 
                        text: `❌ Unknown command: ${text}\nType ${settings.prefix}menu`
                    });
                }
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