/**
 * 👑 QUEEN BELLA MD - Anti Tag Protection
 * Protects group from mass mentions
 */

const settings = require('../settings');
const fs = require('fs');
const path = require('path');

const dataPath = './data/antitag.json';

// Ensure data directory exists
if (!fs.existsSync('./data')) fs.mkdirSync('./data');
if (!fs.existsSync(dataPath)) fs.writeFileSync(dataPath, JSON.stringify({}));

// Different reaction emojis
const ANTITAG_REACTIONS = ['🛡️', '🔒', '🚫', '⚠️', '⚔️', '🛡️', '💪', '🔐'];

module.exports = {
    name: 'antitag',
    aliases: ['at', 'antimention', 'protect'],
    category: 'group',
    description: 'Protect group from mass mentions',
    usage: '.antitag on/off [delete/warn/kick]',
    react: '🛡️',
    async execute(conn, mek, args, chatId, isOwner) {
        try {
            // 👇 REACT WITH RANDOM EMOJI
            const randomReact = ANTITAG_REACTIONS[Math.floor(Math.random() * ANTITAG_REACTIONS.length)];
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

            // Check if admin or owner
            let isAdmin = false;
            try {
                const groupMetadata = await conn.groupMetadata(chatId);
                const senderJid = mek.key.participant || mek.key.remoteJid;
                isAdmin = groupMetadata.participants.some(p => 
                    p.id === senderJid && p.admin === 'admin'
                );
            } catch (e) {
                console.error('Group metadata error:', e);
            }

            if (!isAdmin && !isOwner) {
                await conn.sendMessage(chatId, {
                    text: '❌ Admin or Owner access required.'
                });
                return;
            }

            let settings = JSON.parse(fs.readFileSync(dataPath));
            const status = args[0]?.toLowerCase();
            const action = args[1]?.toLowerCase() || 'delete';

            if (status === 'on') {
                settings[chatId] = { enabled: true, action: action };
                fs.writeFileSync(dataPath, JSON.stringify(settings, null, 2));
                
                await conn.sendMessage(chatId, {
                    react: { text: '✅', key: mek.key }
                });
                
                await conn.sendMessage(chatId, {
                    text: `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   👑 QUEEN BELLA MD V1   ┃
┃   Created by Dev RODGERS  ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

🛡️ *ANTI-TAG PROTECTION*

✅ *Status:* ENABLED
⚡ *Action:* ${action.toUpperCase()}

📌 Anyone who mass-tags will be ${action === 'delete' ? 'silenced' : action === 'warn' ? 'warned' : 'removed'}.

${settings.footer}`
                });
                return;
            }

            if (status === 'off') {
                settings[chatId] = { enabled: false };
                fs.writeFileSync(dataPath, JSON.stringify(settings, null, 2));
                
                await conn.sendMessage(chatId, {
                    react: { text: '❌', key: mek.key }
                });
                
                await conn.sendMessage(chatId, {
                    text: `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   👑 QUEEN BELLA MD V1   ┃
┃   Created by Dev RODGERS  ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

🛡️ *ANTI-TAG PROTECTION*

❌ *Status:* DISABLED

📌 Mass tagging is now allowed.

${settings.footer}`
                });
                return;
            }

            // Show current settings
            const currentSetting = settings[chatId];
            const currentStatus = currentSetting?.enabled ? '✅ ENABLED' : '❌ DISABLED';
            const currentAction = currentSetting?.action || 'delete';

            await conn.sendMessage(chatId, {
                text: `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   👑 QUEEN BELLA MD V1   ┃
┃   Created by Dev RODGERS  ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

🛡️ *ANTI-TAG PROTECTION*

📌 *Status:* ${currentStatus}
⚡ *Action:* ${currentAction.toUpperCase()}

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  📋 USAGE                    ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
• .antitag on delete   — Delete messages + silent
• .antitag on warn     — Delete + warn user
• .antitag on kick     — Delete + kick user
• .antitag off         — Disable protection

${settings.footer}`
            });

        } catch (error) {
            console.error('Error in antitag:', error);
            await conn.sendMessage(chatId, {
                react: { text: '❌', key: mek.key }
            });
            await conn.sendMessage(chatId, {
                text: '❌ Error updating settings.'
            });
        }
    }
};

// ==========================================
// 🛡️ ANTI-TAG WATCHER - Add to index.js
// ==========================================
// This part should be added to your index.js
// in the messages.upsert handler

async function antiTagWatcher(conn, mek, chatId) {
    try {
        // Check if in a group
        if (!chatId.endsWith('@g.us')) return;

        // Check if sender is admin or owner
        let isAdmin = false;
        let isOwner = false;
        const senderJid = mek.key.participant || mek.key.remoteJid;
        const ownerJid = settings.ownerNumber + '@s.whatsapp.net';
        
        if (senderJid === ownerJid) isOwner = true;

        try {
            const groupMetadata = await conn.groupMetadata(chatId);
            isAdmin = groupMetadata.participants.some(p => 
                p.id === senderJid && p.admin === 'admin'
            );
        } catch (e) {}

        // Skip if admin or owner
        if (isAdmin || isOwner) return;

        // Read settings
        const settingsData = JSON.parse(fs.readFileSync(dataPath));
        if (!settingsData[chatId] || !settingsData[chatId].enabled) return;

        // --- ENHANCED DETECTION ---
        const mentions = mek.message?.extendedTextMessage?.contextInfo?.mentionedJid || 
                         mek.message?.imageMessage?.contextInfo?.mentionedJid || 
                         mek.message?.videoMessage?.contextInfo?.mentionedJid || [];

        // Check for @everyone or @here in text
        let text = '';
        if (mek.message?.conversation) text = mek.message.conversation;
        else if (mek.message?.extendedTextMessage?.text) text = mek.message.extendedTextMessage.text;
        else if (mek.message?.imageMessage?.caption) text = mek.message.imageMessage.caption;
        else if (mek.message?.videoMessage?.caption) text = mek.message.videoMessage.caption;

        const isTextTag = text?.includes('@everyone') || text?.includes('@here');
        const isMassTag = mentions.length > 5 || isTextTag;

        if (isMassTag) {
            const action = settingsData[chatId].action || 'delete';

            // --- DELETE THE MESSAGE ---
            await conn.sendMessage(chatId, { 
                delete: mek.key 
            });

            if (action === 'warn') {
                await conn.sendMessage(chatId, { 
                    text: `⚠️ @${senderJid.split('@')[0]}, mass tagging is not allowed!`,
                    mentions: [senderJid]
                });
            } else if (action === 'kick') {
                await conn.groupParticipantsUpdate(chatId, [senderJid], 'remove');
                await conn.sendMessage(chatId, { 
                    text: `🚫 @${senderJid.split('@')[0]} was kicked for mass tagging!`,
                    mentions: [senderJid]
                });
            }
        }
    } catch (error) {
        console.error('Anti-Tag Error:', error);
    }
}

module.exports.antiTagWatcher = antiTagWatcher;