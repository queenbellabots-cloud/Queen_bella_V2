/**
 * 👑 QUEEN BELLA MD - Speed Command
 * Check bot response speed
 */

const settings = require('../settings');

// Different reaction emojis for speed
const SPEED_REACTIONS = ['⚡', '🚀', '💨', '🔥', '🎯', '⚡', '💫', '🌟', '🌀', '💥'];

module.exports = {
    name: 'speed',
    aliases: ['sp', 'response', 'lag'],
    category: 'main',
    description: 'Check bot response speed',
    usage: '.speed',
    react: '⚡',
    async execute(conn, mek, args, chatId, isOwner) {
        try {
            const sender = mek.key.participant || mek.key.remoteJid;
            
            // 👇 REACT WITH RANDOM EMOJI
            const randomReact = SPEED_REACTIONS[Math.floor(Math.random() * SPEED_REACTIONS.length)];
            await conn.sendMessage(chatId, {
                react: { text: randomReact, key: mek.key }
            });

            const start = Date.now();
            
            // Send initial message
            await conn.sendMessage(chatId, { 
                text: '⏳ Measuring speed...' 
            });

            const end = Date.now();
            const latency = end - start;
            
            // Calculate lag
            const lag = (latency / 12).toFixed(2);

            // Get uptime
            const uptime = process.uptime();
            const hours = Math.floor(uptime / 3600);
            const minutes = Math.floor((uptime % 3600) / 60);
            const seconds = Math.floor(uptime % 60);

            // Build speed message
            const speedMessage = `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   👑 QUEEN BELLA MD V1   ┃
┃   Created by Dev RODGERS  ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

🚀 *RESPONSE SPEED*

📡 *Response:* ${latency}ms
🛸 *Lag:* ${lag}ms
⏰ *Uptime:* ${hours}h ${minutes}m ${seconds}s
🟢 *Status:* Online ✅

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  📢 JOIN OUR CHANNEL         ┃
┃  👇 Click the button below    ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

${settings.footer}`;

            // Send with channel context
            await conn.sendMessage(chatId, {
                text: speedMessage,
                contextInfo: {
                    mentionedJid: [sender],
                    forwardingScore: 999,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: settings.channelId || '120363411498601038@newsletter',
                        newsletterName: settings.channelName || 'QUEEN BELLA MD',
                        serverMessageId: 1
                    }
                }
            });

        } catch (error) {
            console.error('Error in speed command:', error);
            await conn.sendMessage(chatId, {
                text: '❌ Error in speed command.'
            });
        }
    }
};