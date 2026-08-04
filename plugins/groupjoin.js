/**
 * 👑 QUEEN BELLA MD - Join Group Command
 * Joins a group using an invite link
 */

const settings = require('../settings');

// Different reaction emojis
const JOIN_REACTIONS = ['📬', '📨', '✉️', '📩', '📫', '📪', '📭', '📮'];

module.exports = {
    name: 'join',
    aliases: ['joinme', 'f_join', 'joingroup'],
    category: 'group',
    description: 'Join a group using an invite link',
    usage: '.join <group link>',
    react: '📬',
    async execute(conn, mek, args, chatId, isOwner) {
        try {
            // 👇 REACT WITH RANDOM EMOJI
            const randomReact = JOIN_REACTIONS[Math.floor(Math.random() * JOIN_REACTIONS.length)];
            await conn.sendMessage(chatId, {
                react: { text: randomReact, key: mek.key }
            });

            // Only owner can use this command
            if (!isOwner) {
                await conn.sendMessage(chatId, {
                    text: '⚠️ *Access Denied*\n\nYou don\'t have permission to use this command. Only my *Owner* can perform this action.'
                });
                return;
            }

            // Get the link from args
            let q = args.join(' ').trim();
            let groupLink = null;

            // Check if link is provided
            if (!q) {
                await conn.sendMessage(chatId, {
                    text: `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   👑 QUEEN BELLA MD V1   ┃
┃   Created by Dev RODGERS  ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

📍 *Please provide a Group Link*

📋 *Usage:* .join https://chat.whatsapp.com/xxxxxx

${settings.footer}`
                });
                return;
            }

            // Extract the invite code from the link
            if (q.includes('https://chat.whatsapp.com/')) {
                groupLink = q.split('https://chat.whatsapp.com/')[1];
                // Remove any trailing characters
                if (groupLink.includes(' ')) {
                    groupLink = groupLink.split(' ')[0];
                }
                if (groupLink.includes('\n')) {
                    groupLink = groupLink.split('\n')[0];
                }
            } else if (q.includes('whatsapp.com/')) {
                groupLink = q.split('whatsapp.com/')[1];
                if (groupLink.includes(' ')) {
                    groupLink = groupLink.split(' ')[0];
                }
            } else {
                // Assume it's just the invite code
                groupLink = q.trim();
            }

            if (!groupLink || groupLink.length < 5) {
                await conn.sendMessage(chatId, {
                    text: '❌ *Invalid Group Link*\n\nMake sure it is a valid WhatsApp invite URL.'
                });
                return;
            }

            // Try to join the group
            try {
                // 👇 REACT WITH PROCESSING
                await conn.sendMessage(chatId, {
                    react: { text: '⏳', key: mek.key }
                });

                await conn.groupAcceptInvite(groupLink);

                // 👇 REACT WITH SUCCESS
                await conn.sendMessage(chatId, {
                    react: { text: '✅', key: mek.key }
                });

                // Send success message
                await conn.sendMessage(chatId, {
                    text: `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   👑 QUEEN BELLA MD V1   ┃
┃   Created by Dev RODGERS  ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

✨ *JOIN SUCCESSFUL!* ✨

✔️ Successfully joined the group
👤 Requested By: ${mek.pushName || 'Owner'}

📌 I am now a member of the group. Ready to manage!

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  📢 JOIN OUR CHANNEL         ┃
┃  👇 Click the button below    ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

${settings.footer}`,
                    contextInfo: {
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
                console.error('Join group error:', error);

                let errorMessage = '❌ *Failed to join group.*';
                if (error.message.includes('already')) {
                    errorMessage = '❌ *Already a member of this group.*';
                } else if (error.message.includes('invalid')) {
                    errorMessage = '❌ *Invalid invite link.*';
                } else if (error.message.includes('expired')) {
                    errorMessage = '❌ *Invite link has expired.*';
                } else if (error.message.includes('full')) {
                    errorMessage = '❌ *Group is full.*';
                }

                await conn.sendMessage(chatId, {
                    react: { text: '❌', key: mek.key }
                });
                await conn.sendMessage(chatId, {
                    text: `❌ *Error Occurred!*\n\n*Details:* ${errorMessage}`
                });
            }

        } catch (error) {
            console.error('Error in join command:', error);
            await conn.sendMessage(chatId, {
                react: { text: '❌', key: mek.key }
            });
            await conn.sendMessage(chatId, {
                text: `❌ *Error Occurred!*\n\n*Details:* ${error.message || 'Unknown error'}`
            });
        }
    }
};