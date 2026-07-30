/**
 * 👑 QUEEN BELLA MD - Menu Command
 */

const moment = require('moment-timezone');
const settings = require('../settings');

module.exports = {
    name: 'menu',
    aliases: ['help', 'allmenu', 'cmds'],
    category: 'main',
    description: 'Show all available commands',
    usage: '.menu',
    async execute(conn, mek, args, chatId, isOwner) {
        try {
            const sender = mek.key.participant || mek.key.remoteJid;
            const pushName = mek.pushName || 'User';
            const userName = pushName || "User";

            // Get all commands
            const commands = global.commands || new Map();
            const cmdList = [];
            const seen = new Set();
            
            for (const [name, cmd] of commands) {
                if (!seen.has(name) && cmd.name === name) {
                    seen.add(name);
                    cmdList.push({
                        name: name,
                        category: cmd.category || 'general'
                    });
                }
            }

            // Group by category
            const categories = {};
            cmdList.forEach(cmd => {
                const category = cmd.category.toUpperCase();
                if (!categories[category]) categories[category] = [];
                categories[category].push(cmd.name);
            });

            const totalCommands = cmdList.length;
            const sortedCategories = Object.keys(categories).sort();

            // Build menu
            let menu = `╔═══════════════════════════════════════╗\n`;
            menu += `║     👑 QUEEN BELLA MD V1 👑          ║\n`;
            menu += `║    Created by Dev RODGERS             ║\n`;
            menu += `╚═══════════════════════════════════════╝\n\n`;
            
            menu += `╔═══════════════════════════════════════╗\n`;
            menu += `║       📊 BOT INFO                    ║\n`;
            menu += `╚═══════════════════════════════════════╝\n`;
            menu += `> 👤 User: ${userName}\n`;
            menu += `> 👑 Owner: ${settings.botOwner}\n`;
            menu += `> 👨‍💻 Developer: Dev RODGERS\n`;
            menu += `> 📱 Number: ${settings.ownerNumber}\n`;
            menu += `> ⚡ Prefix: ${settings.prefix}\n`;
            menu += `> 📊 Commands: ${totalCommands}\n\n`;

            menu += `╔═══════════════════════════════════════╗\n`;
            menu += `║     📋 COMMAND LIST                  ║\n`;
            menu += `╚═══════════════════════════════════════╝\n`;

            for (const category of sortedCategories) {
                menu += `\n┌─── *${category} MENU* ───┐\n`;
                for (const cmdName of categories[category].sort()) {
                    menu += `│ ❍ .${cmdName}\n`;
                }
                menu += `└────────────────────────┘\n`;
            }

            menu += `\n╔═══════════════════════════════════════╗\n`;
            menu += `║  📢 JOIN OUR CHANNEL                 ║\n`;
            menu += `║  👇 Click the button below            ║\n`;
            menu += `╚═══════════════════════════════════════╝\n\n`;
            menu += `${settings.footer}`;

            await conn.sendMessage(chatId, {
                image: { url: settings.menuImage },
                caption: menu,
                contextInfo: {
                    mentionedJid: [sender],
                    forwardingScore: 999,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: settings.channelId,
                        newsletterName: settings.channelName,
                        serverMessageId: 1
                    },
                    externalAdReply: {
                        title: settings.botName,
                        body: `Welcome ${userName}!`,
                        mediaType: 1,
                        renderLargerThumbnail: true,
                        thumbnailUrl: settings.menuImage,
                        sourceUrl: settings.channelLink,
                        mediaUrl: settings.channelLink
                    }
                }
            });

        } catch (error) {
            console.error('Error in menu:', error);
            await conn.sendMessage(chatId, { 
                text: '❌ Error loading menu.'
            });
        }
    }
};