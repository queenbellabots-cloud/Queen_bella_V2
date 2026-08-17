/**
 * QUEEN BELLA MD - Main Handlers
 * Owner = The number that paired with the bot
 */

const settings = require('./settings');
const axios = require('axios');

// ═══════════════════════════════════════════════════════
// 🔧 NUMBER CLEANING FUNCTION - REMOVES WHATSAPP SUFFIX
// ═══════════════════════════════════════════════════════
function cleanNumber(num) {
    if (!num) return '';

    // Remove everything after @
    let cleaned = num.split('@')[0];

    // Remove any non-numeric characters
    cleaned = cleaned.replace(/[^0-9]/g, '');

    // WhatsApp sometimes adds extra digits at the end
    // Standard phone numbers are 10-15 digits
    if (cleaned.length > 15) {
        cleaned = cleaned.substring(0, 15);
    }

    // For Kenyan numbers: 254XXXXXXXXX (12 digits)
    // If it's longer than 12 digits, trim it
    if (cleaned.startsWith('254') && cleaned.length > 12) {
        cleaned = cleaned.substring(0, 12);
    }

    return cleaned;
}

// ═══════════════════════════════════════════════════════
// 🤖 AUTO CHATBOT - Auto-reply to DMs with AI
// ═══════════════════════════════════════════════════════
async function handleAutoChatBot(conn, mek) {
    try {
        // Check if auto-chatbot is enabled
        if (!global.autoChatBot) return;
        
        const chatId = mek.key.remoteJid;
        
        // Only work in DMs (not groups, status, or channels)
        const isGroup = chatId.endsWith('@g.us');
        const isStatus = chatId === 'status@broadcast';
        const isChannel = chatId.includes('@newsletter');
        
        if (isGroup || isStatus || isChannel) return;
        if (mek.key.fromMe) return; // Don't reply to own messages
        
        // Get message text
        let text = '';
        if (mek.message.conversation) {
            text = mek.message.conversation;
        } else if (mek.message.extendedTextMessage) {
            text = mek.message.extendedTextMessage.text;
        } else {
            return; // Only text messages
        }
        
        if (!text || text.startsWith(settings.prefix || '.')) return;
        
        const sender = mek.key.participant || mek.key.remoteJid;
        const pushName = mek.pushName || 'User';
        
        console.log(`🤖 Auto-Reply to ${sender}: ${text.substring(0, 50)}...`);
        
        // Send typing indicator
        await conn.sendPresenceUpdate('composing', chatId);
        
        try {
            // Call AI API
            const response = await axios.post('https://apis.davidcyril.name.ng/ai/gemini-3-pro', {
                message: text,
                name: pushName
            }, {
                headers: { 'Content-Type': 'application/json' },
                timeout: 30000
            });
            
            let reply = response.data?.reply || response.data?.response || response.data?.message || 'Sorry, I could not process that.';
            reply = reply.replace(/\*\*/g, '*').trim();
            
            // Send reply
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
            
            console.log(`✅ Auto-reply sent to ${sender}`);
            
        } catch (error) {
            console.error('Auto-Reply AI Error:', error.message);
            
            let errorMsg = '❌ *AI Service Error*\n\nPlease try again later.';
            if (error.code === 'ECONNABORTED') {
                errorMsg = '⏰ *Timeout!*\n\nThe AI service is taking too long. Please try again.';
            }
            
            await conn.sendMessage(chatId, {
                text: `${errorMsg}\n\n_${settings.footer}_`
            });
        }
        
    } catch (error) {
        console.error('Auto-ChatBot Error:', error);
    }
}

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

        // ═══════════════════════════════════════════════════════
        // 🤖 AUTO CHATBOT - Auto-reply to DMs
        // ═══════════════════════════════════════════════════════
        try {
            await handleAutoChatBot(conn, mek);
        } catch (error) {
            console.error('Auto-ChatBot Error:', error);
        }

        if (!text) return;

        if (text.startsWith(settings.prefix || '.')) {
            const args = text.slice(1).trim().split(' ');
            const commandName = args.shift().toLowerCase();

            const sender = mek.key.participant || mek.key.remoteJid;
            const senderNumber = cleanNumber(sender);

            // ═══════════════════════════════════════════════════════
            // 🔐 OWNER DETECTION - The number that paired with the bot
            // ═══════════════════════════════════════════════════════

            // Get the bot's OWN number (the number that paired)
            const botJid = conn.user.id;
            const botNumber = cleanNumber(botJid);

            // DEBUG - Log for troubleshooting
            console.log('🔍 DEBUG - Number Check:');
            console.log(`   Sender raw: ${sender}`);
            console.log(`   Sender cleaned: ${senderNumber}`);
            console.log(`   Bot raw: ${botJid}`);
            console.log(`   Bot cleaned: ${botNumber}`);

            // The owner is the number that PAIRED with the bot
            const isBotOwner = 
                senderNumber === botNumber ||
                cleanNumber(sender) === cleanNumber(botJid) ||
                senderNumber.includes(botNumber) ||
                botNumber.includes(senderNumber);

            // Developer (hardcoded - RODGERS)
            const developerNumber = settings.developerNumber || '254755660053';
            const isDeveloper = 
                senderNumber === developerNumber ||
                cleanNumber(sender) === developerNumber;

            // Sudo users
            const isSudo = settings.sudoUsers && settings.sudoUsers.some(sudo => 
                senderNumber === sudo || cleanNumber(sender) === sudo
            );

            // Final: isOwner = paired number OR developer OR sudo
            const isOwner = isBotOwner || isDeveloper || isSudo;

            // BOT MODE
            const botMode = settings.mode || global.botMode || 'public';

            // PRIVATE MODE: SILENTLY IGNORE NON-OWNERS
            if (botMode === 'private' && !isOwner) {
                console.log(`🔒 Private mode: Ignoring command "${commandName}" from ${senderNumber}`);
                return;
            }

            console.log(`📥 Command: ${commandName} from ${senderNumber} (Owner: ${isOwner})`);

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
                        text: `❌ Unknown command: ${text}\nType ${settings.prefix}menu for available commands.`
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