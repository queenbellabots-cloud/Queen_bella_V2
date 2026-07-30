module.exports = {
    name: 'uptime',
    aliases: ['runtime', 'up'],
    category: 'main',
    description: 'Show bot uptime',
    usage: '.uptime',
    async execute(conn, mek, args, chatId, isOwner) {
        const uptime = process.uptime();
        const days = Math.floor(uptime / 86400);
        const hours = Math.floor((uptime % 86400) / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        const seconds = Math.floor(uptime % 60);
        
        await conn.sendMessage(chatId, {
            text: `⏰ *QUEEN BELLA MD UPTIME*\n\n` +
                  `${days > 0 ? `📅 Days: ${days}\n` : ''}` +
                  `⏰ Hours: ${hours}\n` +
                  `⏱️ Minutes: ${minutes}\n` +
                  `⏱️ Seconds: ${seconds}\n\n` +
                  `🟢 Status: Online ✅\n\n` +
                  `© MADE BY RODGERS`
        });
    }
};