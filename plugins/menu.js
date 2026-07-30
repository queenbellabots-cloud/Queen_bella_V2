/**
 * 👑 QUEEN BELLA MD - Menu Command
 * Displays all available commands with channel button
 */

const fs = require('fs');
const path = require('path');
const moment = require('moment-timezone');

const MENU_IMAGE_URL = "https://i.imgur.com/687ZxLW.jpeg"; // Replace with your image

// =====================
// Simple Greeting Logic
// =====================
const getGreeting = () => {
    const hour = moment().tz('Africa/Nairobi').hour();
    if (hour >= 5 && hour < 12) return "Good Morning 🌅";
    if (hour >= 12 && hour < 17) return "Good Afternoon ☀️";
    if (hour >= 17 && hour < 21) return "Good Evening 🌆";
    return "Good Night 😴";
};

// =====================
// MENU COMMAND
// =====================
module.exports = {
    name: 'menu',
    aliases: ['help', 'allmenu', 'cmds'],
    category: 'main',
    description: 'Show all available commands with channel button',
    usage: '.menu',
    react: '✨',
    async execute(conn, mek, args, chatId, isOwner) {
        try {
            const sender = mek.key.participant || mek.key.remoteJid;
            const pushName = mek.pushName || 'User';
            const userName = pushName || conn.getName(sender) || "User";

            const now = moment().tz("Africa/Nairobi");
            const date = now.format("DD/MM/YYYY");
            const time = now.format("HH:mm:ss");
            const greeting = getGreeting();

            // Get all commands from global map
            const commands = global.commands || new Map();
            const cmdList = [];
            
            // Collect unique commands (avoid duplicates from aliases)
            const seen = new Set();
            for (const [name, cmd] of commands) {
                if (!seen.has(name) && cmd.name === name) {
                    seen.add(name);
                    cmdList.push({
                        name: name,
                        category: cmd.category || 'general',
                        description: cmd.description || 'No description',
                        usage: cmd.usage || name,
                        aliases: cmd.aliases || []
                    });
                }
            }

            // Group commands by category
            const categories = {};
            cmdList.forEach(cmd => {
                const category = cmd.category.toUpperCase();
                if (!categories[category]) {
                    categories[category] = [];
                }
                categories[category].push(cmd);
            });

            const totalCommands = cmdList.length;
            const sortedCategories = Object.keys(categories).sort();

            // =====================
            // BUILD MENU
            // =====================
            let menu = `
╔═══════════════════════════════╗
║     👑 QUEEN BELLA MD 👑      ║
║    Created by Dev RODGERS      ║
╚═══════════════════════════════╝

╔═══════════════════════════════╗
║       📊 BOT INFO            ║
╚═══════════════════════════════╝
> 🕵️ *User:* ${userName}
> 📅 *Date:* ${date}
> ⏰ *Time:* ${time}
> ${greeting}
> ⭐ *Total Commands:* ${totalCommands}
> ⚡ *Prefix:* .
> 👑 *Owner:* 𝐑𝐎𝐃𝐆𝐄𝐑𝐒 𝐎𝐍𝐘𝐀𝐍𝐆𝐎

╔═══════════════════════════════╗
║     📋 COMMAND LIST          ║
╚═══════════════════════════════╝\n`;

            // Add commands by category
            for (const category of sortedCategories) {
                menu += `\n┌─── *${category} MENU* ───┐\n`;
                const sortedCmds = categories[category].sort((a, b) => a.name.localeCompare(b.name));
                for (const cmd of sortedCmds) {
                    menu += `│ ❍ .${cmd.name}\n`;
                }
                menu += `└────────────────────────┘\n`;
            }

            menu += `
╔═══════════════════════════════╗
║  📢 JOIN OUR CHANNEL         ║
║  👇 Click the button below    ║
╚═══════════════════════════════╝

© MADE BY RODGERS`;

            // =====================
            // CREATE CHANNEL CONTEXT INFO
            // =====================
            const newsletterContextInfo = {
                mentionedJid: [sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363423209691396@newsletter', // Your channel ID
                    newsletterName: '👑 QUEEN BELLA MD 👑',
                    serverMessageId: 1
                }
            };

            // =====================
            // SEND MENU WITH IMAGE
            // =====================
            await conn.sendMessage(chatId, {
                image: { url: MENU_IMAGE_URL },
                caption: menu,
                contextInfo: {
                    ...newsletterContextInfo,
                    externalAdReply: {
                        title: "👑 QUEEN BELLA MD",
                        body: `Welcome ${userName}!`,
                        mediaType: 1,
                        renderLargerThumbnail: true,
                        thumbnailUrl: MENU_IMAGE_URL,
                        sourceUrl: 'https://whatsapp.com/channel/0029Va...', // Your channel link
                        mediaUrl: 'https://whatsapp.com/channel/0029Va...' // Your channel link
                    }
                }
            });

        } catch (error) {
            console.error('Error in menu command:', error);
            await conn.sendMessage(chatId, { 
                text: '❌ Error loading menu. Please try again.'
            });
        }
    }
};