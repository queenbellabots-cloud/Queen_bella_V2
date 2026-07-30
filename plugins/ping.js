module.exports = {
    name: 'ping',
    aliases: ['p'],
    category: 'main',
    description: 'Check bot latency',
    usage: '.ping',
    react: '🏓',
    async execute(conn, mek, args, chatId, isOwner) {
        try {
            const start = Date.now();
            const uptime = process.uptime();
            const hours = Math.floor(uptime / 3600);
            const minutes = Math.floor((uptime % 3600) / 60);
            const seconds = Math.floor(uptime % 60);
            
            const response = `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃      🏓 PONG!                ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

📡 Latency: ${Date.now() - start}ms
⏰ Uptime: ${hours}h ${minutes}m ${seconds}s
🟢 Status: Connected ✅
👑 Bot: QUEEN BELLA MD

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  📢 JOIN OUR CHANNEL         ┃
┃  👇 Click the button below    ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

${settings.footer}`;

            await conn.sendMessage(chatId, {
                text: response,
                contextInfo: {
                    forwardingScore: 999,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: settings.channelId,
                        newsletterName: settings.channelName,
                        serverMessageId: 1
                    }
                }
            });
        } catch (error) {
            console.error('Error in ping:', error);
            await conn.sendMessage(chatId, { text: '❌ Error in ping command' });
        }
    }
};