/**
 * QUEEN BELLA MD - Main Handlers
 */

const settings = require('./settings');

async function handleMessages(conn, chatUpdate, isOwner) {
    try {
        const mek = chatUpdate.messages[0];
        if (!mek || !mek.message) return;

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

            // ✅ EVERYONE CAN USE - NO RESTRICTIONS!
            const sender = mek.key.participant || mek.key.remoteJid;
            const senderNumber = sender ? sender.split('@')[0] : 'Unknown';

            console.log(`📥 Command: ${commandName} from ${senderNumber}`);

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