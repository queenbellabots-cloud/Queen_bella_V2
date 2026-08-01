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

            // Build menu - CLEAN VERSION
            let menu = '╔═══════════════════════════════════════╗\n';
            menu += '║       QUEEN BELLA V1                  ║\n';
            menu += '║   POWERED BY DEV RODGERS              ║\n';
            menu += '╚═══════════════════════════════════════╝\n';
            menu += '                    BOT INFO\n';
            menu += '╠═══════════════════════════════════════╣\n';
            menu += '👤 User: ' + userName + '\n';
            menu += '👑 Owner: ' + userNameDisplay + '\n';
            menu += '👨‍💻 Developer: DEV RODGERS\n';
            menu += '📱 Number: ' + userNumber + '\n';
            menu += '⚡ Prefix: ' + (settings.prefix || '.') + '\n';
            menu += '📊 Commands: ' + totalCommands + '\n';
            menu += '🔒 Mode: ' + mode + '\n\n';

            menu += '┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓\n';
            menu += '┃     COMMAND LIST                     ┃\n';
            menu += '┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛\n';

            for (const category of sortedCategories) {
                menu += '\n╦══════' + category + ' MENU═════╦\n';
                for (const cmdName of categories[category].sort()) {
                    menu += '╠  .' + cmdName + '\n';
                }
                menu += '╚═══════════════════════╩\n';
            }

            menu += '\n╔═══════════════════════════════════════╗\n';
            menu += '║  📢 JOIN OUR CHANNEL                   ║\n';
            menu += '║  👇 Click the button below              ║\n';
            menu += '╚═══════════════════════════════════════╝\n\n';
            menu += '© A BELLA BOTS PRODUCTIONS';

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