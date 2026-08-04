/**
 * 👑 QUEEN BELLA MD - Tag Admins Command
 * Tags all group admins with optional message
 */

const settings = require('../settings');

// Different reaction emojis
const TAGADMIN_REACTIONS = ['👮', '👮‍♂️', '👮‍♀️', '🛡️', '⭐', '👑', '🌟', '💫'];

module.exports = {
    name: 'tagadmins',
    aliases: ['taggcadmins', 'taggroupadmins', 'tadmins'],
    category: 'group',
    description: 'Tag all group admins with optional message',
    usage: '.tagadmins <message>',
    react: '👮',
    async execute(conn, mek, args, chatId, isOwner) {
        try {
            // 👇 REACT WITH RANDOM EMOJI
            const randomReact = TAGADMIN_REACTIONS[Math.floor(Math.random() * TAGADMIN_REACTIONS.length)];
            await conn.sendMessage(chatId, {
                react: { text: randomReact, key: mek.key }
            });

            // Check if in a group
            const isGroup = chatId.endsWith('@g.us');
            if (!isGroup) {
                await conn.sendMessage(chatId, {
                    text: '❌ This command only works in groups!'
                });
                return;
            }

            // Check if user is admin or owner
            let isAdmin = false;
            try {
                const groupMetadata = await conn.groupMetadata(chatId);
                const senderJid = mek.key.participant || mek.key.remoteJid;
                isAdmin = groupMetadata.participants.some(p => 
                    p.id === senderJid && p.admin === 'admin'
                );
            } catch (e) {}

            if (!isAdmin && !isOwner) {
                await conn.sendMessage(chatId, {
                    text: '❌ Admin/Owner Only Command!'
                });
                return;
            }

            // Get the message
            const q = args.join(' ') || '';

            // Get group metadata
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

            // Identify admins and superadmins
            const superAdmins = [];
            const admins = [];

            for (let p of participants) {
                if (p.admin === 'superadmin') {
                    superAdmins.push(p.id);
                } else if (p.admin === 'admin') {
                    admins.push(p.id);
                }
            }

            const allAdmins = [...superAdmins, ...admins];
            
            if (allAdmins.length === 0) {
                await conn.sendMessage(chatId, {
                    text: '❌ No admins found in this group!'
                });
                return;
            }

            // Build mentions
            const senderJid = mek.key.participant || mek.key.remoteJid;
            let mentions = [...allAdmins, senderJid];

            // Build message
            let text = `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   👑 QUEEN BELLA MD V1   ┃
┃   Created by Dev RODGERS  ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

👮 *TAG ADMINS*

📌 *Group:* ${groupName}`;

            if (q && q.trim()) {
                text += `\n📝 *Message:* ${q.trim()}`;
            }

            text += `\n\n👤 *Tagged By:* @${senderJid.split('@')[0]}

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  👥 ADMINS LIST               ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛`;

            // Building the list with emojis
            for (let id of superAdmins) {
                text += `\n👑 @${id.split('@')[0]}`;
            }
            for (let id of admins) {
                text += `\n👮 @${id.split('@')[0]}`;
            }

            text += `\n\n┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  📢 JOIN OUR CHANNEL         ┃
┃  👇 Click the button below    ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

${settings.footer}`;

            // 👇 REACT WITH SUCCESS
            await conn.sendMessage(chatId, {
                react: { text: '✅', key: mek.key }
            });

            // Send the message
            await conn.sendMessage(chatId, {
                text: text.trim(),
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
            console.error('Tagadmins error:', error);
            await conn.sendMessage(chatId, {
                react: { text: '❌', key: mek.key }
            });
            await conn.sendMessage(chatId, {
                text: `❌ Failed to tag admins: ${error.message}`
            });
        }
    }
};