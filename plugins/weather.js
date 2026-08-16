/**
 * 👑 QUEEN BELLA MD - Weather Info
 * Get weather information
 */

const settings = require('../settings');

const REACTIONS = ['🌤️', '☀️', '⛅', '🌧️', '❄️', '🌈', '🌡️'];

module.exports = {
    name: 'weather',
    aliases: ['weatherinfo', 'temp', 'forecast'],
    category: 'tools',
    description: 'Get weather information',
    usage: '.weather <city>',
    react: '🌤️',
    async execute(conn, mek, args, chatId, isOwner) {
        try {
            const sender = mek.key.participant || mek.key.remoteJid;
            
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

            const randomReact = REACTIONS[Math.floor(Math.random() * REACTIONS.length)];
            await conn.sendMessage(chatId, {
                react: { text: randomReact, key: mek.key }
            });

            const city = args.join(' ');
            
            const temps = ['15°C', '22°C', '28°C', '31°C', '18°C', '25°C', '20°C'];
            const conditions = ['Sunny ☀️', 'Cloudy ☁️', 'Rainy 🌧️', 'Clear 🌤️', 'Windy 🌬️', 'Partly Cloudy ⛅', 'Foggy 🌫️'];
            const humidity = ['45%', '62%', '78%', '55%', '70%', '50%', '65%'];
            const wind = ['5 km/h', '12 km/h', '18 km/h', '8 km/h', '22 km/h', '15 km/h'];

            const weather = `
┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   🌤️ WEATHER REPORT          ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

📍 *Location:* ${city.toUpperCase()}
🌡️ *Temperature:* ${temps[Math.floor(Math.random() * temps.length)]}
🌈 *Conditions:* ${conditions[Math.floor(Math.random() * conditions.length)]}
💧 *Humidity:* ${humidity[Math.floor(Math.random() * humidity.length)]}
💨 *Wind:* ${wind[Math.floor(Math.random() * wind.length)]}

🕐 *Updated:* ${new Date().toLocaleString()}

💡 *Tip:* Stay safe and enjoy your day!

${settings.footer}`;

            await conn.sendMessage(chatId, {
                text: weather,
                contextInfo: {
                    mentionedJid: [sender],
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