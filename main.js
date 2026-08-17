/**
 * QUEEN BELLA MD - Main Handlers
 * Owner = The number that paired with the bot
 */

const settings = require('./settings');

// Helper function to clean number
function cleanNumber(num) {
    if (!num) return '';
    // Remove @s.whatsapp.net, @c.us, etc.
    const cleaned = num.split('@')[0];
    // Remove any non-numeric characters
    return cleaned.replace(/[^0-9]/g, '');
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
            
            // The owner is the number that PAIRED with the bot
            const isBotOwner = 
                senderNumber === botNumber ||
                sender === botJid ||
                cleanNumber(sender) === cleanNumber(botJid);

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
    handleGroupParticipantUpdate
};