const { cmd } = require('../command');
const config = require('../config');

cmd({
    pattern: "owner",
    alias: ["developer", "popkid"],
    desc: "Get information about the bot owner",
    category: "main",
    react: "👑",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    try {
        const ownerNumber = "254755660053"; // Your WhatsApp number
        const ownerName = "Dev Rodgers Kenya";
        const ownerOrg = "RoyTech Developers";
        const githubProfile = "queenbellabots-cloud/Queen_bella_V2";
        const profilePic = "https://i.imgur.com/687ZxLW.jpeg"; // Your preferred image

        // Define the vCard format
        const vcard = 'BEGIN:VCARD\n'
            + 'VERSION:3.0\n'
            + `FN:${ownerName}\n`
            + `ORG:${ownerOrg};\n`
            + `TEL;type=CELL;type=VOICE;waid=${ownerNumber}:+${ownerNumber}\n`
            + `URL;type=github:${githubProfile}\n`
            + 'END:VCARD';

        // Message body
        let ownerMsg = `👑 *QUEEN_BELLA-MD OWNER INFO* 👑

👤 *Name:* ${ownerName}
🌍 *Location:* Kenya 🇰🇪
💻 *Role:* Bot Developer
🔗 *GitHub:* ${githubProfile}

> *Feel free to contact me for script updates or bot deployment! Jo dala mae maruu😂😂* ⚡`;

        // 1. Send the Contact Card first
        await conn.sendMessage(from, {
            contacts: {
                displayName: ownerName,
                contacts: [{ vcard }]
            }
        }, { quoted: mek });

        // 2. Send the Image with the details
        await conn.sendMessage(from, {
            image: { url: profilePic },
            caption: ownerMsg,
            contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: config.NEWSLETTER_JID || '120363423209691396@newsletter',
                    newsletterName: 'QUEEN BELLA UPDATES',
                    serverMessageId: 1
                }
            }
        }, { quoted: mek });

    } catch (e) {
        console.log(e);
        reply("❌ Could not fetch owner information.");
    }
});
