module.exports = {
    name: 'autoviewstatus',
    aliases: ['avs', 'statusview'],
    category: 'main',
    description: 'Toggle auto-view status',
    usage: '.autoviewstatus',
    async execute(conn, mek, args, chatId, isOwner) {
        const status = global.autoViewStatus || false;
        global.autoViewStatus = !status;
        
        await conn.sendMessage(chatId, {
            text: `👑 *Auto-View Status*\n\n` +
                  `✅ Status: ${global.autoViewStatus ? 'ENABLED' : 'DISABLED'}\n` +
                  `📌 When enabled, bot will automatically view status updates.\n\n` +
                  `© MADE BY RODGERS`
        });
    }
};