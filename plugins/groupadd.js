/**
 * 👑 QUEEN BELLA MD - Add Member to Group
 * Adds a person to the group
 */

const settings = require('../settings');

// Different reaction emojis
const ADD_REACTIONS = ['👤', '➕', '✅', '✨', '🎯', '🚀', '💫', '🌟'];

module.exports = {
    name: 'add',
    aliases: ['invite', 'addmember', 'a', 'summon'],
    category: 'group',
    description: 'Adds a person to the group',
    usage: '.add @user or .add 2547XXXXXXXX',
    react: '👤',
    async execute(conn, mek, args, chatId, isOwner) {
        try {
            // 👇 REACT WITH RANDOM EMOJI
            const randomReact = ADD_REACTIONS[Math.floor(Math.random() * ADD_REACTIONS.length)];
            await conn.sendMessage(chatId, {
                react: { text: randomReact, key: mek.key }
            });

            // Check if in a group
            const isGroup = chatId.endsWith('@g.us');
            if (!isGroup) {
                await conn.sendMessage(chatId, {
                    text: '❌ This command is for groups only.'
                });
                return;
            }

            // Check if owner
            if (!isOwner) {
                await conn.sendMessage(chatId, {
                    text: '📛 *Access Denied:* Owner command only.'
                });
                return;
            }

            // Get group metadata to check bot admin status
            try {
                const groupMetadata = await conn.groupMetadata(chatId);
                const botJid = conn.user.id.split(':')[0] + '@s.whatsapp.net';
                const isBotAdmin = groupMetadata.participants.some(p => 
                    p.id === botJid && p.admin === 'admin'
                );

                if (!isBotAdmin) {
                    await conn.sendMessage(chatId, {
                        text: '❌ I need admin rights to add members.'
                    });
                    return;
                }
            } catch (e) {
                console.error('Group metadata error:', e);
            }

            // Identify Target JID
            let targetJid = null;

            // Check if user is mentioned
            if (mek.message?.extendedTextMessage?.contextInfo?.mentionedJid) {
                targetJid = mek.message.extendedTextMessage.contextInfo.mentionedJid[0];
            }

            // Check if replying to a message
            if (!targetJid && mek.message?.extendedTextMessage?.contextInfo?.quotedMessage) {
                const quoted = mek.message.extendedTextMessage.contextInfo.quotedMessage;
                if (quoted) {
                    targetJid = mek.message.extendedTextMessage.contextInfo.participant || 
                               mek.message.extendedTextMessage.contextInfo.remoteJid;
                }
            }

            // Check if number is provided in args
            if (!targetJid && args.length > 0) {
                let number = args[0].replace(/[^0-9]/g, '');
                if (number.startsWith('0')) number = '254' + number.slice(1);
                if (!number.startsWith('254')) number = '254' + number;
                targetJid = number + '@s.whatsapp.net';
            }

            if (!targetJid) {
                await conn.sendMessage(chatId, {
                    text: `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   👑 QUEEN BELLA MD V1   ┃
┃   Created by Dev RODGERS  ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

📍 *Please mention, reply, or provide a number.*

📋 *Examples:*
• .add @user
• .add 2547XXXXXXXX
• Reply to a user's message with .add

${settings.footer}`
                });
                return;
            }

            // Check if trying to add self
            const botJid = conn.user.id.split(':')[0] + '@s.whatsapp.net';
            if (targetJid === botJid) {
                await conn.sendMessage(chatId, {
                    text: '🤦 I\'m already here!'
                });
                return;
            }

            // Add user to group
            await conn.groupParticipantsUpdate(chatId, [targetJid], 'add');

            // 👇 REACT WITH SUCCESS
            await conn.sendMessage(chatId, {
                react: { text: '✅', key: mek.key }
            });

            // Send success message
            const targetName = await conn.getName(targetJid) || targetJid.split('@')[0];
            await conn.sendMessage(chatId, {
                text: `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   👑 QUEEN BELLA MD V1   ┃
┃   Created by Dev RODGERS  ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

✅ *SUCCESS!*

👤 @${targetJid.split('@')[0]} has been added to the group.

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  📢 JOIN OUR CHANNEL         ┃
┃  👇 Click the button below    ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

${settings.footer}`,
                mentions: [targetJid]
            });

        } catch (error) {
            console.error('Error in add command:', error);
            await conn.sendMessage(chatId, {
                react: { text: '❌', key: mek.key }
            });
            await conn.sendMessage(chatId, {
                text: `❌ *Operation Failed*\n\n_User might have privacy settings enabled or left recently._`
            });
        }
    }
};