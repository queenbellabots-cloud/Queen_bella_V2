const settings = require('../settings');

module.exports = {
    name: 'autoviewstatus',
    aliases: ['avs', 'statusview'],
    category: 'main',
    description: 'Toggle auto-view status',
    usage: '.autoviewstatus',
    react: '👁️',
    async execute(conn, mek, args, chatId, isOwner) {
        const status = global.autoViewStatus || false;
        global.autoViewStatus = !status;
        
        const response = `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   👑 QUEEN BELLA MD V1   ┃
┃   Created by Dev RODGERS  ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

👑 AUTO-VIEW STATUS

✅ Status: ${global.autoViewStatus ? 'ENABLED' : 'DISABLED'}
📌 When enabled, bot will automatically view status updates.

${settings.footer}`;

        await conn.sendMessage(chatId, { text: response });
    }
};