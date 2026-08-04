/**
 * 👑 QUEEN BELLA MD - Owner/Developer Info
 * Shows developer contact information
 */

const settings = require('../settings');

module.exports = {
    name: 'owner',
    aliases: ['creator', 'developer', 'dev'],
    category: 'main',
    description: 'Show developer/owner information',
    usage: '.owner',
    react: '👑',
    async execute(conn, mek, args, chatId, isOwner) {
        try {
            const sender = mek.key.participant || mek.key.remoteJid;
            
            // 👇 REACT
            await conn.sendMessage(chatId, {
                react: { text: '👑', key: mek.key }
            });

            // Get the actual bot owner (person using the bot)
            const botOwnerName = settings.botOwner || 'QUEEN BELLA USER';
            const botOwnerNumber = settings.ownerNumber || '254755660053';

            // Developer info (YOU)
            const devName = settings.developerName || '𝐑𝐎𝐃𝐆𝐄𝐑𝐒';
            const devNumber = settings.developerNumber || '254755660053';
            const devChannel = settings.developerChannel || settings.channelLink;

            const ownerText = `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   👑 QUEEN BELLA MD V1   
┃   Created by Dev RODGERS  
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

👤 *BOT OWNER* (This bot is deployed by)
Name: ${botOwnerName}
Number: ${botOwnerNumber}

👨‍💻 *DEVELOPER* (Bot Creator)
Name: ${devName}
Number: ${devNumber}
Channel: ${devChannel}

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  📢 JOIN OUR CHANNEL         
┃  👇 Click the button below    
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

${settings.footer}`;

            await conn.sendMessage(chatId, {
                text: ownerText,
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
            console.error('Error in owner command:', error);
            await conn.sendMessage(chatId, { 
                text: '❌ Error loading owner info.'
            });
        }
    }
};