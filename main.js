/**
 * 👑 QUEEN BELLA MD - Main Handlers
 * This file handles all bot events and message processing
 */

const { handleStatusUpdate } = require('./plugins/autostatus');

async function handleMessages(conn, chatUpdate, isOwner) {
    try {
        const mek = chatUpdate.messages[0];
        if (!mek || !mek.message) return;
        
        const text = mek.message?.conversation || 
                     mek.message?.extendedTextMessage?.text || 
                     mek.message?.imageMessage?.caption || '';
        
        if (!text) return;
        
        // Check if command exists
        if (text.startsWith('.')) {
            const args = text.slice(1).trim().split(' ');
            const commandName = args.shift().toLowerCase();
            
            // Check if command exists in global commands
            if (global.commands && global.commands.has(commandName)) {
                const command = global.commands.get(commandName);
                try {
                    await command.execute(conn, mek, args, mek.key.remoteJid, mek.key.fromMe);
                } catch (error) {
                    console.error('Error executing command:', error);
                    await conn.sendMessage(mek.key.remoteJid, { 
                        text: '❌ Error executing command!' 
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
        // Handle group participant updates (join/leave)
        console.log('👥 Group update:', update);
    } catch (error) {
        console.error('Error in group update:', error);
    }
}

async function handleStatus(conn, update) {
    try {
        // Handle status updates
        console.log('📱 Status update received');
    } catch (error) {
        console.error('Error in status handler:', error);
    }
}

module.exports = {
    handleMessages,
    handleGroupParticipantUpdate,
    handleStatus
}