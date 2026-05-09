const { cmd } = require('../command');
const config = require('../config');
const moment = require('moment-timezone');

cmd({
    pattern: "ping",
    desc: "iOS style speed check",
    category: "main",
    filename: __filename
}, async (conn, m, mek, { from, sender, reply }) => {
    try {
        const start = Date.now();
        await conn.sendMessage(from, { react: { text: "⚡", key: mek.key } });
        const end = Date.now();
        
        // Clean iOS-style text layout
        const speedMessage = `*ᴘɪɴɢ ꜱᴛᴀᴛᴜꜱ* 🚀\n\n*ʟᴀᴛᴇɴᴄʏ:* ${end - start}ms\n*ꜱᴛᴀᴛᴜꜱ:* Online`;

        // iOS-style vCard (Professional & Minimalist)
        const iosvCard = {
            key: {
                fromMe: false,
                participant: "0@s.whatsapp.net",
                remoteJid: "status@broadcast"
            },
            message: {
                contactMessage: {
                    displayName: " QUEEN BELLA-MD",
                    vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:QUEENBELLA\nTEL;type=CELL;type=VOICE;waid=254755660053:+254755660053\nEND:VCARD`
                }
            }
        };

        // iOS Newsletter/Ad Context (No big image, very clean)
        const iosContext = {
            mentionedJid: [sender],
            forwardingScore: 999,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
                newsletterJid: config.NEWSLETTER_JID || '120363423209691396@newsletter',
                newsletterName: "ǫᴜᴇᴇɴ ʙᴇʟʟᴀ-ᴍᴅ ɴᴇᴛᴡᴏʀᴋ",
                serverMessageId: 1
            },
            externalAdReply: {
                title: " ǫᴜᴇᴇɴ ʙᴇʟʟᴀ ꜱʏꜱᴛᴇᴍꜱ",
                body: "ᴀɴᴀʟʏᴢɪɴɢ ʀᴇꜱᴘᴏɴꜱᴇ ᴛɪᴍᴇ...",
                mediaType: 1,
                renderLargerThumbnail: false, // Keeps it small and clean like iOS notifications
                thumbnailUrl: "https://i.imgur.com/687ZxLW.jpeg", // Small icon style
                sourceUrl: "https://whatsapp.com/channel/0029VbBR3ib3LdQQlEG3vd1x"
            }
        };

        await conn.sendMessage(from, { 
            text: speedMessage, 
            contextInfo: iosContext 
        }, { quoted: iosvCard });

    } catch (err) {
        console.error("PING ERROR:", err);
        reply("❌ *System Error.*");
    }
});
