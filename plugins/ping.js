module.exports = {
    name: 'ping',
    aliases: ['p'],
    category: 'main',
    description: 'Check bot latency',
    usage: '.ping',
    async execute(conn, mek, args, chatId, isOwner) {
        const start = Date.now();
        await conn.sendMessage(chatId, { text: '⏳ Checking...' });
        const latency = Date.now() - start;
        const uptime = process.uptime();
        const hours = Math.floor(uptime / 3600);
        const minutes = Math.floor((uptime % 3600) / 60);
        const seconds = Math.floor(uptime % 60);
        
        await conn.sendMessage(chatId, { 
            text: `🏓 *PONG!*\n\n` +
                  `📡 *Latency:* ${latency}ms\n` +
                  `⏰ *Uptime:* ${hours}h ${minutes}m ${seconds}s\n` +
                  `🟢 *Status:* Connected ✅\n` +
                  `👑 *Bot:* QUEEN BELLA MD`
        });
    }
};