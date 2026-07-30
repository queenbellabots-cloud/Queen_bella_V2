const settings = require('../settings');
const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'mode',
    aliases: ['public', 'private'],
    category: 'main',
    description: 'Check or change bot mode (public/private)',
    usage: '.mode or .mode public/private',
    react: '🔒',
    async execute(conn, mek, args, chatId, isOwner) {
        try {
            // Only owner can change mode
            if (!isOwner) {
                await conn.sendMessage(chatId, {
                    text: `🔒 *QUEEN BELLA MD MODE*\n\nCurrent Mode: ${settings.commandMode.toUpperCase()}\n\nOnly the owner can change the mode.`
                });
                return;
            }

            // If no args, show current mode
            if (!args || args.length === 0) {
                await conn.sendMessage(chatId, {
                    text: `🔒 *QUEEN BELLA MD MODE*\n\nCurrent Mode: ${settings.commandMode.toUpperCase()}\n\nTo change:\n.mode public - Everyone can use\n.mode private - Only you can use`
                });
                return;
            }

            // Change mode
            const newMode = args[0].toLowerCase();
            if (newMode !== 'public' && newMode !== 'private') {
                await conn.sendMessage(chatId, {
                    text: '❌ Invalid mode! Use: .mode public or .mode private'
                });
                return;
            }

            // Update settings
            settings.commandMode = newMode;
            
            // Save to file
            const settingsPath = path.join(process.cwd(), 'settings.js');
            const settingsContent = `const settings = {
  prefix: "${settings.prefix}",
  botName: "${settings.botName}",
  botOwner: "${settings.botOwner}",
  ownerNumber: "${settings.ownerNumber}",
  commandMode: "${newMode}",
  usePairingCode: ${settings.usePairingCode},
  autoRead: ${settings.autoRead},
  channelId: "${settings.channelId}",
  channelName: "${settings.channelName}",
  channelLink: "${settings.channelLink}",
  botImage: "${settings.botImage}",
  menuImage: "${settings.menuImage}",
  ownerImage: "${settings.ownerImage}",
  footer: "${settings.footer}"
};

global.prefix = settings.prefix;
module.exports = settings;`;

            fs.writeFileSync(settingsPath, settingsContent);
            
            await conn.sendMessage(chatId, {
                text: `✅ *Mode Changed Successfully!*\n\nMode: ${newMode.toUpperCase()}\n\n${newMode === 'public' ? '👥 Everyone can use commands.' : '🔒 Only you can use commands.'}`
            });

        } catch (error) {
            console.error('Error in mode:', error);
            await conn.sendMessage(chatId, { 
                text: '❌ Error changing mode.'
            });
        }
    }
};