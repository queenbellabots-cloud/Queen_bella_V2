/**
 * 👑 QUEEN BELLA MD - Promote Admin Command
 * Promotes a member to admin
 */

const settings = require('../settings');

// Different reaction emojis
const PROMOTE_REACTIONS = ['⬆️', '🔼', '📈', '⭐', '👑', '🌟', '💫', '✨'];

module.exports = {
    name: 'promote',
    aliases: ['addadmin', 'makeadmin', 'admin'],
    category: 'group',
    description: 'Promote a member to admin',
    usage: '.promote @user or reply to user',
    react: '⬆️',
    async execute(conn, mek, args, chatId, isOwner) {
        try {
            // 👇 REACT WITH RANDOM EMOJI
            const randomReact = PROMOTE_REACTIONS[Math.floor(Math.random() * PROMOTE_REACTIONS.length)];
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
                        text: '❌ I need to be an admin to promote someone.'
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

❌ *Please mention or reply to a user to promote.*

📋 *Examples:*
• .promote @user
• Reply to a user's message with .promote
• .promote 2547XXXXXXXX

${settings.footer}`
                });
                return;
            }

            // Check if trying to promote self
            const senderJid = mek.key.participant || mek.key.remoteJid;
            if (targetJid === senderJid) {
                await conn.sendMessage(chatId, {
                    text: '🤦 You cannot promote yourself!'
                });
                return;
            }

            // Check if trying to promote bot
            const botJid = conn.user.id.split(':')[0] + '@s.whatsapp.net';
            if (targetJid === botJid) {
                await conn.sendMessage(chatId, {
                    text: '🤖 I am already an admin!'
                });
                return;
            }

            // Check if user is already admin
            try {
                const groupMetadata = await conn.groupMetadata(chatId);
                const isAlreadyAdmin = groupMetadata.participants.some(p => 
                    p.id === targetJid && p.admin === 'admin'
                );
                if (isAlreadyAdmin) {
                    await conn.sendMessage(chatId, {
                        text: '👑 This user is already an admin!'
                    });
                    return;
                }
            } catch (e) {}

            // Get target name
            try {
                targetName = await conn.getName(targetJid) || targetJid.split('@')[0];
            } catch (e) {}

            // Promote user
            await conn.groupParticipantsUpdate(chatId, [targetJid], 'promote');

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

⬆️ *PROMOTE SUCCESSFUL!*

👤 @${targetJid.split('@')[0]} has been promoted to admin.

👑 *Status:* ADMIN ✅

${settings.footer}`,
                mentions: [targetJid]
            });

        } catch (error) {
            console.error('Error in promote command:', error);
            await conn.sendMessage(chatId, {
                react: { text: '❌', key: mek.key }
            });
            await conn.sendMessage(chatId, {
                text: '❌ Failed to promote user. Make sure the bot is admin and the user is a member.'
            });
        }
    }
};