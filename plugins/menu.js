/**
 * 👑 QUEEN BELLA MD - Menu Command
 */

const settings = require('../settings');

module.exports = {
    name: 'menu',
    aliases: ['help', 'allmenu', 'cmds'],
    category: 'main',
    description: 'Show all available commands',
    usage: '.menu',
    react: '👑',
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

            // Get user info
            const userNameDisplay = settings.botOwner || 'QUEEN BELLA USER';
            const userNumber = settings.ownerNumber || '254755660053';
            const mode = settings.commandMode ? settings.commandMode.toUpperCase() : 'PUBLIC';

            // Pick random menu image
            const menuImages = settings.menuImages || [
                "https://imagetourl.cloud/9eumy3kr.jpg",
                "https://imagetourl.cloud/jey865he.jpg",
                "https://imagetourl.cloud/8uafyai1.jpg"
            ];
            const randomImage = menuImages[Math.floor(Math.random() * menuImages.length)];

            // YOUR EXACT DESIGN - COPY PASTED DIRECTLY
            let menu = ╔═════════════════════════════════╗
║       𝐐𝐔𝐄𝐄𝐍 𝐁𝐄𝐋𝐋𝐀 𝐕𝟏              
║   𝙿𝙾𝚆𝙴𝚁𝙴𝙳 𝙱𝚈 𝙳𝙴𝚅 𝚁𝙾𝙳𝙶𝙴𝚁𝚂          
╚═════════════════════════════════╝
                    𝐁𝐎𝐓 𝐈𝐍𝐅𝐎
╠═════════════════════════════════╣
👤 User: ${userName}
👑 Owner: ${userNameDisplay}
👨‍💻 Developer: ᴅᴇᴠ ʀᴏᴅɢᴇʀs
📱 Number: ${userNumber}
⚡ Prefix: ${settings.prefix || '.'}
📊 Commands: ${totalCommands}
🔒 Mode: ${mode}

┏━━━━━━━━━━━━━━━━━━━━┓
┃     𝐂𝐎𝐌𝐌𝐀𝐍𝐃𝐋𝐈𝐒𝐓      
┗━━━━━━━━━━━━━━━━━━━━┛
╦══════MAIN MENU═════╦
╠  .alive
╠  .autoviewstatus
╠  .info
╠  .menu
╠  .mode
╠  .owner
╠  .ping
╠  .uptime
╚═══════════════════╩

╦═════TOOLS MENU═════╦
╠  .vv
╚═══════════════════╩
╔═════════════════════════╗
║  📢 JOIN OUR CHANNEL                   
║  👇 Click the button below              
╚═════════════════════════╝

© ᴀ ʙᴇʟʟᴀ ʙᴏᴛs ᴘʀᴏᴅᴜᴛɪᴏɴs`;

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
                    }
                }
            });

        } catch (error) {
            console.error('Error in menu:', error);
            await conn.sendMessage(chatId, { 
                text: '❌ Error loading menu. Please try again.'
            });
        }
    }
};