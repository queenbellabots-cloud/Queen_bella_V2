module.exports = {
    name: 'alive',
    aliases: ['status', 'check'],
    category: 'main',
    description: 'Check if bot is alive',
    usage: '.alive',
    async execute(conn, mek, args, chatId, isOwner) {
        const uptime = process.uptime();
        const hours = Math.floor(uptime / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        const seconds = Math.floor(uptime % 60);
        const commands = global.commands?.size || 0;
        
        await conn.sendMessage(chatId, { 
            text: `👑 *QUEEN BELLA MD IS ALIVE!*\n\n` +
                  `✅ *Status:* Online\n` +
                  `⏰ *Uptime:* ${hours}h ${minutes}m ${seconds}s\n` +
                  `⚡ *Prefix:* .\n` +
                  `📊 *Commands:* ${commands}\n\n` +
                  `© MADE BY RODGERS`
        });
    }
};