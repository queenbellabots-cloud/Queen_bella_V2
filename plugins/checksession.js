/**
 * 👑 QUEEN BELLA MD - Check Session Status
 * Checks if pairing is complete and returns session ID
 */

const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'api_checksession',
    async execute(code) {
        try {
            const session = global.pairSessions?.[code];
            if (!session) {
                return { error: 'Session not found' };
            }

            const credsPath = path.join(session.sessionFolder, 'creds.json');
            if (fs.existsSync(credsPath)) {
                try {
                    const creds = fs.readFileSync(credsPath);
                    const sessionId = creds.toString('base64');
                    
                    // Send session ID to user's WhatsApp
                    const { sock, number } = session;
                    const ownerJid = number + '@s.whatsapp.net';
                    
                    await sock.sendMessage(ownerJid, {
                        text: `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   👑 QUEEN BELLA MD V1   ┃
┃   Created by Dev RODGERS  ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

✅ *PAIRING SUCCESSFUL!*

📌 *Your Session ID:*
\`\`\`
${sessionId}
\`\`\`

📋 *Next Steps:*
1. Copy the session ID above
2. Open config.js
3. Paste it in: sessionId: ""
4. Deploy on Katabump

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  📢 JOIN OUR CHANNEL         ┃
┃  👇 Click the button below    ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

© A BELLA BOTS PRODUCTIONS`
                    });

                    return { success: true, sessionId: sessionId, number: number };
                } catch (e) {
                    return { error: 'Session not ready' };
                }
            }

            return { success: false, ready: false };
        } catch (error) {
            return { error: error.message };
        }
    }
};