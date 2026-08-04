/**
 * 👑 QUEEN BELLA MD - Demote Admin Command
 * Demotes an admin to a regular member
 */

const settings = require('../settings');

// Different reaction emojis
const DEMOTE_REACTIONS = ['⬇️', '🔽', '📉', '👇', '⬇️', '🔄', '📊', '⏬'];

module.exports = {
    name: 'demote',
    aliases: ['removeadmin', 'unadmin', 'demoteadmin'],
    category: 'group',
    description: 'Demote an admin to regular member',
    usage: '.demote @user or reply to user',
    react: '⬇️',
    async execute(conn, mek, args, chatId, isOwner) {
        try {
            // 👇 REACT WITH RANDOM EMOJI
            const randomReact = DEMOTE_REACTIONS[Math.floor(Math.random() * DEMOTE_REACTIONS.length)];
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

            // Check if bot is admin
            try {
                const groupMetadata = await conn.groupMetadata(chatId);
                const botJid = conn.user.id.split(':')[0] + '@s.whatsapp.net';
                const isBotAdmin = groupMetadata.participants.some(p => 
                    p.id === botJid && p.admin === 'admin'
                );

                if (!isBotAdmin) {
                    await conn.sendMessage(chatId, {
                        text: '❌ I need to be an admin to demote someone.'
                    });
                    return;
                }
            } catch (e) {
                console.error('Group metadata error:', e);
            }

            // Identify target user
            let targetJid = null;
            let targetName = 'User';

            // Check if user is mentioned
            if (mek.message?.extendedTextMessage?.contextInfo?.mentionedJid) {
                targetJid = mek.message.extendedTextMessage.contextInfo.mentionedJid[0];
            }

            // Check if replying to a message
            if (!targetJid && mek.message?.extendedTextMessage?.contextInfo?.quotedMessage) {
                targetJid = mek.message.extendedTextMessage.contextInfo.participant || 
                           mek.message.extendedTextMessage.contextInfo.remoteJid;
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

❌ *Please mention or reply to a user to demote.*

📋 *Examples:*
• .demote @user
• Reply to a user's message with .demote
• .demote 2547XXXXXXXX

${settings.footer}`
                });
                return;
            }

            // Check if trying to demote self
            const senderJid = mek.key.participant || mek.key.remoteJid;
            if (targetJid === senderJid) {
                await conn.sendMessage(chatId, {
                    text: '🤦 You cannot demote yourself!'
                });
                return;
            }

            // Check if trying to demote bot
            const botJid = conn.user.id.split(':')[0] + '@s.whatsapp.net';
            if (targetJid === botJid) {
                await conn.sendMessage(chatId, {
                    text: '🤖 I cannot demote myself!'
                });
                return;
            }

            // Get target name
            try {
                targetName = await conn.getName(targetJid) || targetJid.split('@')[0];
            } catch (e) {}

            // Demote user
            await conn.groupParticipantsUpdate(chatId, [targetJid], 'demote');

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

⬇️ *DEMOTE SUCCESSFUL!*

👤 @${targetJid.split('@')[0]} has been demoted from admin to member.

${settings.footer}`,
                mentions: [targetJid]
            });

        } catch (error) {
            console.error('Error in demote command:', error);
            await conn.sendMessage(chatId, {
                react: { text: '❌', key: mek.key }
            });
            await conn.sendMessage(chatId, {
                text: '❌ Failed to demote user. Make sure the bot is admin and the user is an admin.'
            });
        }
    }
};