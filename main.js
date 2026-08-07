/**
 * QUEEN BELLA MD - Main Handlers
 * Fixed to respond to ALL private messages
 * Added Public/Private Mode Control
 */

const settings = require('./settings');

async function handleMessages(conn, chatUpdate, isOwner) {
    try {
        const mek = chatUpdate.messages[0];
        if (!mek || !mek.message) return;

        const chatId = mek.key.remoteJid;

        // ✅ ALLOW ALL MESSAGES - Including private DMs from anyone
        const isGroup = chatId.endsWith('@g.us');
        const isStatus = chatId === 'status@broadcast';
        const isChannel = chatId.includes('@newsletter');

        // ✅ ONLY SKIP status and channel messages
        if (isStatus || isChannel) return;

        // Get text from message
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

        // Check if command exists
        if (text.startsWith(settings.prefix || '.')) {
            const args = text.slice(1).trim().split(' ');
            const commandName = args.shift().toLowerCase();

            const sender = mek.key.participant || mek.key.remoteJid;
            const senderNumber = sender ? sender.split('@')[0] : 'Unknown';
            const ownerNumber = settings.ownerNumber || '254755660053';

            // 🔐 Check if sender is the bot owner
            const isOwner = 
                sender === ownerNumber + '@s.whatsapp.net' || 
                sender === ownerNumber + '@c.us' ||
                senderNumber === ownerNumber;

            // 🔐 BOT MODE CHECK (Public/Private)
            const botMode = global.botMode || 'public';
            
            // If bot is in private mode, only owner can use commands
            if (botMode === 'private' && !isOwner) {
                await conn.sendMessage(mek.key.remoteJid, {
                    text: `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   👑 QUEEN BELLA MD V1   ┃
┃   Created by Dev RODGERS  ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

🔒 *BOT IS IN PRIVATE MODE*

Only the bot owner can use commands.

👑 *Owner:* ${settings.botOwner || 'QUEEN BELLA USER'}
📱 *Number:* ${ownerNumber}

📌 *Contact the owner to request access.*

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  📢 JOIN OUR CHANNEL         ┃
┃  👇 Click the button below    ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

${settings.footer}`
                });
                return;
            }

            console.log(`📥 Command: ${commandName} from ${senderNumber} in ${isGroup ? 'GROUP' : 'PRIVATE DM'}`);

            if (global.commands && global.commands.has(commandName)) {
                const command = global.commands.get(commandName);
                try {
                    console.log(`✅ Executing: ${commandName}`);
                    await command.execute(conn, mek, args, mek.key.remoteJid, isOwner);
                    console.log(`✅ Command executed: ${commandName}`);
                } catch (error) {
                    console.error(`❌ Error executing ${commandName}:`, error);
                    await conn.sendMessage(mek.key.remoteJid, { 
                        text: '❌ Error executing command!'
                    });
                }
            } else {
                // Command not found
                await conn.sendMessage(mek.key.remoteJid, { 
                    text: `❌ Unknown command: ${text}\nType ${settings.prefix}menu for available commands.`
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
    handleGroupParticipantUpdate
};