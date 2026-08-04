/**
 * 👑 QUEEN BELLA MD - Ping Command
 * Check bot latency with user counter
 */

const settings = require('../settings');
const moment = require('moment-timezone');
const fs = require('fs');
const path = require('path');

// Different reaction emojis for ping
const PING_REACTIONS = ['⚡', '🚀', '💨', '🔥', '🎯', '⚡', '💫', '🌟'];

// File to store user counts
const STATS_FILE = path.join(__dirname, '../data/stats.json');

// Function to get or create stats
function getStats() {
    try {
        if (!fs.existsSync(STATS_FILE)) {
            // Create stats file if it doesn't exist
            const defaultStats = {
                totalUsers: 0,
                uniqueUsers: {},
                totalDeployments: 0,
                commandsUsed: {}
            };
            fs.writeFileSync(STATS_FILE, JSON.stringify(defaultStats, null, 2));
            return defaultStats;
        }
        const data = fs.readFileSync(STATS_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading stats:', error);
        return { totalUsers: 0, uniqueUsers: {}, totalDeployments: 0, commandsUsed: {} };
    }
}

// Function to save stats
function saveStats(stats) {
    try {
        // Ensure data directory exists
        const dataDir = path.join(__dirname, '../data');
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }
        fs.writeFileSync(STATS_FILE, JSON.stringify(stats, null, 2));
    } catch (error) {
        console.error('Error saving stats:', error);
    }
}

// Function to increment user count
function incrementUser(userId) {
    const stats = getStats();
    
    // Check if user is new
    if (!stats.uniqueUsers[userId]) {
        stats.uniqueUsers[userId] = {
            firstSeen: new Date().toISOString(),
            totalCommands: 0
        };
        stats.totalUsers++;
    }
    
    stats.uniqueUsers[userId].totalCommands++;
    stats.totalDeployments++;
    
    saveStats(stats);
    return stats;
}

module.exports = {
    name: 'ping',
    aliases: ['p', 'latency', 'stats'],
    category: 'main',
    description: 'Check bot latency with user stats',
    usage: '.ping',
    react: '⚡',
    async execute(conn, mek, args, chatId, isOwner) {
        try {
            const sender = mek.key.participant || mek.key.remoteJid;
            const senderNumber = sender.split('@')[0];
            
            // 👇 REACT WITH RANDOM EMOJI
            const randomReact = PING_REACTIONS[Math.floor(Math.random() * PING_REACTIONS.length)];
            await conn.sendMessage(chatId, {
                react: { text: randomReact, key: mek.key }
            });

            // 👇 INCREMENT USER COUNT
            const stats = incrementUser(senderNumber);
            
            const start = Date.now();
            
            // Send initial message
            await conn.sendMessage(chatId, { 
                text: '⏳ Checking latency...' 
            });

            const end = Date.now();
            const latency = end - start;
            
            // Get uptime
            const uptime = process.uptime();
            const hours = Math.floor(uptime / 3600);
            const minutes = Math.floor((uptime % 3600) / 60);
            const seconds = Math.floor(uptime % 60);

            // Get total commands count
            const totalCommands = global.commands?.size || 0;

            // Build ping message with user stats
            const pingMessage = `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   👑 QUEEN BELLA MD V1   ┃
┃   Created by Dev RODGERS  ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

⚡ *PING STATUS* 🚀

📡 *Latency:* ${latency}ms
🟢 *Status:* Online ✅
⏰ *Uptime:* ${hours}h ${minutes}m ${seconds}s

📊 *BOT STATISTICS*
👥 *Total Users:* ${stats.totalUsers}
📱 *Your ID:* ${senderNumber}
📦 *Total Deployments:* ${stats.totalDeployments}
📋 *Commands Available:* ${totalCommands}

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  📢 JOIN OUR CHANNEL         ┃
┃  👇 Click the button below    ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

${settings.footer}`;

            // Send with channel context
            await conn.sendMessage(chatId, {
                text: pingMessage,
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
            console.error('Error in ping command:', error);
            await conn.sendMessage(chatId, {
                text: '❌ Error in ping command.'
            });
        }
    }
};