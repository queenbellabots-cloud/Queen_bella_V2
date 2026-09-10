/**
 * 👑 QUEEN BELLA MD - WhatsApp Info Lookup
 * Get any number's WhatsApp info
 */

const settings = require('../settings');

module.exports = {
    name: 'whois',
    aliases: ['lookup', 'checknum', 'info'],
    category: 'tools',
    description: 'Get full WhatsApp info about any number',
    usage: '.whois +254712345678',
    react: '🔍',
    async execute(conn, mek, args, chatId, isOwner) {
        try {
            const sender = mek.key.participant || mek.key.remoteJid;

            if (!args.length) {
                await conn.sendMessage(chatId, {
                    text: `🔍 *WhatsApp Lookup*\n\nUsage: .whois +<number>\nExample: .whois +254712345678`
                });
                return;
            }

            let targetNumber = args[0].replace(/[^0-9]/g, '');

            if (!targetNumber || targetNumber.length < 10) {
                await conn.sendMessage(chatId, { text: '❌ Invalid number!' });
                return;
            }

            await conn.sendMessage(chatId, {
                react: { text: '🔍', key: mek.key }
            });

            const targetJid = targetNumber + '@s.whatsapp.net';

            // Check if on WhatsApp
            const [result] = await conn.onWhatsApp(targetJid);
            const isRegistered = result?.exists || false;

            // Get profile picture
            let ppStatus = '❌ Not available';
            let ppUrl = null;
            try {
                ppUrl = await conn.profilePictureUrl(targetJid, 'image');
                ppStatus = '✅ Available';
            } catch (e) {
                ppStatus = '❌ Hidden/None';
            }

            // Get business info
            let businessInfo = '❌ Personal account';
            try {
                const biz = await conn.getBusinessProfile(targetJid);
                if (biz) {
                    businessInfo = `✅ Business Account\n📧 Email: ${biz.email || 'N/A'}\n📍 Address: ${biz.address || 'N/A'}`;
                }
            } catch (e) {}

            const info = `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   🔍 WHATSAPP LOOKUP         ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

📱 *Number:* +${targetNumber}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 *CHECK RESULTS:*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🟢 *On WhatsApp:* ${isRegistered ? '✅ YES' : '❌ NO'}
🖼️ *Profile Picture:* ${ppStatus}
💼 *Account Type:* ${businessInfo}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📌 *Verified:* ${new Date().toLocaleString()}

${settings.footer}`;

            if (ppUrl && isRegistered) {
                await conn.sendMessage(chatId, {
                    image: { url: ppUrl },
                    caption: info,
                    contextInfo: { mentionedJid: [sender] }
                });
            } else {
                await conn.sendMessage(chatId, {
                    text: info,
                    contextInfo: { mentionedJid: [sender] }
                });
            }

        } catch (error) {
            console.error('Whois error:', error);
            await conn.sendMessage(chatId, { text: '❌ Lookup failed.' });
        }
    }
};