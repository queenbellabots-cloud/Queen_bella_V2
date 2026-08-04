/**
 * 👑 QUEEN BELLA MD - Tag All Command
 * Mentions all members with a stylish header
 */

const settings = require('../settings');
const { isBotAdmin } = require('./checkadmin');

// Different reaction emojis
const TAGALL_REACTIONS = ['📣', '🔊', '📢', '🗣️', '📯', '📨', '📬', '📭'];

module.exports = {
    name: 'tagall',
    aliases: ['everyone', 'all', 'mentionall', 'alltag'],
    category: 'group',
    description: 'Mention all members with a stylish header',
    usage: '.tagall <message>',
    react: '📣',
    async execute(conn, mek, args, chatId, isOwner) {
        try {
            // 👇 REACT WITH RANDOM EMOJI
            const randomReact = TAGALL_REACTIONS[Math.floor(Math.random() * TAGALL_REACTIONS.length)];
            await conn.sendMessage(chatId, {
                react: { text: randomReact, key: mek.key }
            });

            // Check if in a group
            const isGroup = chatId.endsWith('@g.us');
            if (!isGroup) {
                await conn.sendMessage(chatId, {
                    text: '❌ This command is for groups only!'
                });
                return;
            }

            // ✅ FIXED ADMIN CHECK - USING HELPER
            const botAdmin = await isBotAdmin(conn, chatId);
            if (!botAdmin) {
                await conn.sendMessage(chatId, {
                    text: '❌ I need to be an admin to tag all members.'
                });
                return;
            }

            // Get the message
            const q = args.join(' ') || 'Hey everyone, pay attention to this group!';

            // Get group metadata and participants
            let groupMetadata;
            try {
                groupMetadata = await conn.groupMetadata(chatId);
            } catch (e) {
                await conn.sendMessage(chatId, {
                    text: '❌ Failed to fetch group data. Please try again.'
                });
                return;
            }

            const participants = groupMetadata.participants || [];
            const groupName = groupMetadata.subject || 'Group';

            // Build mentions and tag message
            let mentions = [];
            let tagMessage = `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   👑 QUEEN BELLA MD V1   ┃
┃   Created by Dev RODGERS  ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

📢 *GROUP ANNOUNCEMENT*

📌 *Group:* ${groupName}
👤 *By:* ${mek.pushName || 'User'}
👥 *Members:* ${participants.length}

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  📝 MESSAGE                   ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

${q}

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  👥 MEMBERS LIST              ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛`;

            // Add all members with mentions
            for (let participant of participants) {
                const jid = participant.id;
                tagMessage += `\n🔹 @${jid.split('@')[0]}`;
                mentions.push(jid);
            }

            tagMessage += `\n\n┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  📢 JOIN OUR CHANNEL         ┃
┃  👇 Click the button below    ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

${settings.footer}`;

            // 👇 REACT WITH SUCCESS
            await conn.sendMessage(chatId, {
                react: { text: '✅', key: mek.key }
            });

            // Send tag all message
            await conn.sendMessage(chatId, {
                text: tagMessage,
                mentions: mentions,
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
            console.error('Error in tagall command:', error);
            await conn.sendMessage(chatId, {
                react: { text: '❌', key: mek.key }
            });
            await conn.sendMessage(chatId, {
                text: '❌ Failed to tag all members. Make sure the bot is admin.'
            });
        }
    }
};