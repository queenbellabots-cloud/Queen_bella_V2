/**
 * 👑 QUEEN BELLA MD - Get Profile Picture Command
 * Downloads a person's WhatsApp profile picture
 */

const settings = require('../settings');

module.exports = {
    name: 'getdp',
    aliases: ['dp', 'profilepic', 'pp', 'avatar'],
    category: 'tools',
    description: 'Download a person\'s WhatsApp profile picture',
    usage: '.getdp @user or reply to message',
    react: '🖼️',
    async execute(conn, mek, args, chatId, isOwner) {
        try {
            // 👇 REACT WITH FRAME EMOJI
            await conn.sendMessage(chatId, {
                react: { text: '🖼️', key: mek.key }
            });

            let targetJid = null;
            let targetName = 'User';

            // Method 1: Check if user is mentioned
            if (mek.message?.extendedTextMessage?.contextInfo?.mentionedJid) {
                targetJid = mek.message.extendedTextMessage.contextInfo.mentionedJid[0];
            }

            // Method 2: Check if replying to a message
            if (!targetJid && mek.message?.extendedTextMessage?.contextInfo?.quotedMessage) {
                targetJid = mek.message.extendedTextMessage.contextInfo.participant || 
                           mek.message.extendedTextMessage.contextInfo.remoteJid;
            }

            // Method 3: Check if number is provided in args
            if (!targetJid && args.length > 0) {
                let number = args[0].replace(/[^0-9]/g, '');
                if (number.startsWith('0')) number = '254' + number.slice(1);
                if (!number.startsWith('254')) number = '254' + number;
                targetJid = number + '@s.whatsapp.net';
            }

            // Method 4: If no target, get the sender's own DP
            if (!targetJid) {
                targetJid = mek.key.participant || mek.key.remoteJid;
            }

            if (!targetJid) {
                await conn.sendMessage(chatId, {
                    text: `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   👑 QUEEN BELLA MD V1   ┃
┃   Created by Dev RODGERS  ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

🖼️ *GET PROFILE PICTURE*

❌ Please mention, reply, or provide a number.

📋 *Examples:*
• .getdp @user
• Reply to a user's message with .getdp
• .getdp 2547XXXXXXXX

📌 *To get your own DP:* Just type .getdp

${settings.footer}`
                });
                return;
            }

            // Get the target's name
            try {
                const name = await conn.getName(targetJid);
                if (name) targetName = name;
            } catch (e) {}

            // Get the profile picture
            let ppUrl = null;
            let ppBuffer = null;

            try {
                // Try to get high quality DP
                ppUrl = await conn.profilePictureUrl(targetJid, 'image');
            } catch (e) {
                // Try with 'preview' quality
                try {
                    ppUrl = await conn.profilePictureUrl(targetJid, 'preview');
                } catch (e2) {
                    // No profile picture found
                }
            }

            if (!ppUrl) {
                await conn.sendMessage(chatId, {
                    text: `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   👑 QUEEN BELLA MD V1   ┃
┃   Created by Dev RODGERS  ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

❌ *NO PROFILE PICTURE*

👤 *User:* ${targetName}
📱 *Number:* ${targetJid.split('@')[0]}

📌 This user does not have a profile picture set.

${settings.footer}`
                });
                return;
            }

            // Download the profile picture
            try {
                const axios = require('axios');
                const response = await axios.get(ppUrl, {
                    responseType: 'arraybuffer'
                });
                ppBuffer = Buffer.from(response.data);
            } catch (downloadError) {
                console.error('Download error:', downloadError);
                await conn.sendMessage(chatId, {
                    text: '❌ Failed to download profile picture.'
                });
                return;
            }

            // Send the profile picture
            await conn.sendMessage(chatId, {
                image: ppBuffer,
                caption: `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   👑 QUEEN BELLA MD V1   ┃
┃   Created by Dev RODGERS  ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

🖼️ *PROFILE PICTURE*

👤 *User:* ${targetName}
📱 *Number:* ${targetJid.split('@')[0]}
🕒 *Time:* ${new Date().toLocaleString()}

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  📢 JOIN OUR CHANNEL         ┃
┃  👇 Click the button below    ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

${settings.footer}`,
                contextInfo: {
                    forwardingScore: 999,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: settings.channelId,
                        newsletterName: settings.channelName,
                        serverMessageId: 1
                    }
                }
            });

            // 👇 REACT WITH SUCCESS
            await conn.sendMessage(chatId, {
                react: { text: '✅', key: mek.key }
            });

        } catch (error) {
            console.error('Error in getdp:', error);
            await conn.sendMessage(chatId, {
                react: { text: '❌', key: mek.key }
            });
            await conn.sendMessage(chatId, {
                text: `❌ Error getting profile picture: ${error.message}`
            });
        }
    }
};