/**
 * 👑 QUEEN BELLA MD - Deployment Guide
 */

const settings = require('../settings');

module.exports = {
    name: 'guide',
    aliases: ['deploy', 'setup'],
    category: 'help',
    description: 'Step-by-step deployment guide',
    usage: '.guide',
    react: '📚',
    async execute(conn, mek, args, chatId, isOwner) {
        try {
            await conn.sendMessage(chatId, {
                react: { text: '📚', key: mek.key }
            });

            const guide = `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   👑 QUEEN BELLA MD V1   ┃
┃   Created by Dev RODGERS  ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

📚 *DEPLOYMENT GUIDE*

📌 *Step 1: Download Repo*
.rodgers or visit:
${settings.channelLink || 'https://github.com/queenbellabots-cloud/Queen_bella_V2'}

📌 *Step 2: Deploy on Katabump*
1. Go to https://control.katabump.com/
2. Create a new server
3. Upload the ZIP file
4. Extract and deploy

📌 *Step 3: Configure Settings*
1. Open settings.js
2. Change ownerNumber to your number
3. Change botName if desired
4. Save the file

📌 *Step 4: Start the Bot*
1. Run: npm install
2. Run: npm start
3. Enter pairing code

📌 *Step 5: Enjoy!*
• Send .menu to see all commands
• Send .help for assistance

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  📢 JOIN OUR CHANNEL         ┃
┃  👇 Click the button below    ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

${settings.footer}`;

            await conn.sendMessage(chatId, { text: guide });

        } catch (error) {
            console.error('Error in guide:', error);
            await conn.sendMessage(chatId, {
                text: '❌ Error loading guide.'
            });
        }
    }
};