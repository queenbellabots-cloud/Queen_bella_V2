cat > /home/container/plugins/weather.js << 'EOF'
/**
 * 👑 QUEEN BELLA MD - Weather Info
 * Get weather information
 */

const settings = require('../settings');

module.exports = {
    name: 'weather',
    aliases: ['weatherinfo', 'temp'],
    category: 'tools',
    description: 'Get weather information',
    usage: '.weather <city>',
    react: '🌤️',
    async execute(conn, mek, args, chatId, isOwner) {
        try {
            if (!args.length) {
                await conn.sendMessage(chatId, {
                    react: { text: '❌', key: mek.key }
                });
                await conn.sendMessage(chatId, { 
                    text: `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   🌤️ WEATHER INFO           ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

❌ *No city provided!*

📝 *Usage:*
.weather <city name>

📌 *Example:*
.weather Nairobi

${settings.footer}`
                });
                return;
            }

            await conn.sendMessage(chatId, {
                react: { text: '🌤️', key: mek.key }
            });

            const city = args.join(' ');
            
            // Mock weather (Replace with actual API later)
            const temps = ['15°C', '22°C', '28°C', '31°C', '18°C'];
            const conditions = ['Sunny ☀️', 'Cloudy ☁️', 'Rainy 🌧️', 'Clear 🌤️', 'Windy 🌬️'];
            const humidity = ['45%', '62%', '78%', '55%', '70%'];

            const weather = `
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   🌤️ WEATHER REPORT          ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

📍 *Location:* ${city.toUpperCase()}
🌡️ *Temperature:* ${temps[Math.floor(Math.random() * temps.length)]}
🌈 *Conditions:* ${conditions[Math.floor(Math.random() * conditions.length)]}
💧 *Humidity:* ${humidity[Math.floor(Math.random() * humidity.length)]}
💨 *Wind:* ${Math.floor(Math.random() * 20 + 5)} km/h

🕐 *Updated:* ${new Date().toLocaleString()}

💡 *Tip:* Stay safe and enjoy your day!

${settings.footer}`;

            await conn.sendMessage(chatId, {
                text: weather,
                contextInfo: {
                    mentionedJid: [mek.key.participant || mek.key.remoteJid],
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
            console.error('Error in weather command:', error);
            await conn.sendMessage(chatId, { 
                text: '❌ Error getting weather information.'
            });
        }
    }
};
EOF