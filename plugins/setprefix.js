const { cmd } = require('../command');
const config = require('../config');

cmd({
    pattern: "setprefix",
    desc: "Update prefix with iOS style and fake vCard",
    category: "owner",
    react: "⚙️",
    filename: __filename
}, async (conn, m, mek, { from, reply, text, isOwner }) => {

    // 🛡️ Owner Check
    if (!isOwner) return reply("*❌ ᴏᴡɴᴇʀ ᴏɴʟʏ ᴄᴏᴍᴍᴀɴᴅ*");

    // Check for input
    if (!text) return reply("*⚠️ ᴘʟᴇᴀsᴇ ᴘʀᴏᴠɪᴅᴇ ᴀ ɴᴇᴡ ᴘʀᴇғɪx (ᴇ.ɢ .sᴇᴛᴘʀᴇғɪx Queen bella)*");

    try {
        const previousPrefix = config.PREFIX;
        const newPrefix = text.trim();
        
        // Update the live config
        config.PREFIX = newPrefix;

        // Define the iOS-style fake vCard (Rodgers Ke)
        const fakevCard = {
            key: {
                fromMe: false,
                participant: "0@s.whatsapp.net",
                remoteJid: "status@broadcast"
            },
            message: {
                contactMessage: {
                    displayName: " POPKID SETTINGS",
                    vcard: `BEGIN:VCARD\nVERSION:3.0\nFN:Queenbella Ke\nORG:Queenbella Systems;\nTEL;type=CELL;type=VOICE;waid=254755660053:+254755660053\nEND:VCARD`
                }
            }
        };

        // iOS Styled Caption
        const caption = `* ǫᴜᴇᴇɴ ʙᴇʟʟᴀ ꜱʏꜱᴛᴇᴍ ᴄᴏɴꜰɪɢ* ⚙️\n\n` +
                        `*✨ ꜱᴛᴀᴛᴜꜱ:* Prefix Successfully Migrated\n\n` +
                        `*⬅️ ᴘʀᴇᴠɪᴏᴜꜱ:* 「 ${previousPrefix} 」\n` +
                        `*➡️ ᴄᴜʀʀᴇɴᴛ:* 「 ${newPrefix} 」\n\n` +
                        `*💡 ɴᴏᴛᴇ:* All commands including words/letters now trigger with *${newPrefix}*\n\n` +
                        `> *ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴘᴏᴘᴋɪᴅ-xᴍᴅ*`;

        // Send with Newsletter Context (Small Thumbnail - iOS Style)
        await conn.sendMessage(from, { 
            image: { url: config.ALIVE_IMG || "https://files.catbox.moe/7t824v.jpg" }, 
            caption: caption,
            contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: config.NEWSLETTER_JID || '120363423209691396@newsletter',
                    newsletterName: "ǫᴜᴇᴇɴ ʙᴇʟʟᴀ ꜱʏꜱᴛᴇᴍ ᴜᴘᴅᴀᴛᴇꜱ",
                    serverMessageId: 1
                },
                externalAdReply: {
                    title: " ᴘʀᴇꜰɪx ᴍᴀɴᴀɢᴇʀ",
                    body: `ꜱʏꜱᴛᴇᴍ ᴘʀᴇꜰɪx: ${newPrefix}`,
                    mediaType: 1,
                    renderLargerThumbnail: false,
                    thumbnailUrl: "https://i.imgur.com/687ZxLW.jpeg",
                    sourceUrl: "https://whatsapp.com/channel/0029VbBR3ib3LdQQlEG3vd1x"
                }
            }
        }, { quoted: fakevCard });

    } catch (e) {
        console.error("SET_PREFIX_ERROR:", e);
        reply("*❗ sʏsᴛᴇᴍ ᴇʀʀᴏʀ: ᴜɴᴀʙʟᴇ ᴛᴏ ᴍᴏᴅɪғʏ ᴘʀᴇғɪx*");
    }
});
