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

            // Pick random menu image
            const menuImages = settings.menuImages || [
                "https://imagetourl.cloud/9eumy3kr.jpg",
                "https://imagetourl.cloud/jey865he.jpg",
                "https://imagetourl.cloud/8uafyai1.jpg"
            ];
            const randomImage = menuImages[Math.floor(Math.random() * menuImages.length)];

            // Build menu
            let menu = `╔═══════════════════════════════════════╗
║     👑 QUEEN BELLA MD V1 👑          ║
║    Created by Dev RODGERS             ║
╚═══════════════════════════════════════╝

╔═══════════════════════════════════════╗
║       📊 BOT INFO                    ║
╚═══════════════════════════════════════╝
> 👤 User: ${userName}
> 👑 Owner: ${settings.botOwner}
> 👨‍💻 Developer: Dev RODGERS
> 📱 Number: ${settings.ownerNumber}
> ⚡ Prefix: ${settings.prefix}
> 📊 Commands: ${totalCommands}
> 🟢 Mode: ${settings.commandMode || 'PUBLIC'}

╔═══════════════════════════════════════╗
║     📋 COMMAND LIST                  ║
╚═══════════════════════════════════════╝`;

            for (const category of sortedCategories) {
                menu += `\n┌─── *${category} MENU* ───┐`;
                for (const cmdName of categories[category].sort()) {
                    menu += `\n│ ❍ .${cmdName}`;
                }
                menu += `\n└────────────────────────┘`;
            }

            menu += `\n
╔═══════════════════════════════════════╗
║  📢 JOIN OUR CHANNEL                 ║
║  👇 Click the button below            ║
╚═══════════════════════════════════════╝

${settings.footer}`;

            await conn.sendMessage(chatId, {
                image: { url: randomImage },
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
                        thumbnailUrl: randomImage,
                        sourceUrl: settings.channelLink,
                        mediaUrl: settings.channelLink
                    }
                }
            });

        } catch (error) {
            console.error('Error in menu:', error);
            // Try sending without image if error
            try {
                await conn.sendMessage(chatId, { 
                    text: '❌ Error loading menu. Please try again.'
                });
            } catch (e) {
                console.error('Failed to send error message:', e);
            }
        }
    }
};