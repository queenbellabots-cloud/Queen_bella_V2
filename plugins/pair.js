/**
 * 👑 QUEEN BELLA MD - Pairing API for Website
 * Receives requests from the pair site and generates codes
 */

const { default: makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys');
const fs = require('fs');
const path = require('path');

// Store active pairing sessions
global.pairSessions = global.pairSessions || {};

module.exports = {
    name: 'api_pair',
    // This is NOT a user command - it's for the website
    async execute(conn, number) {
        try {
            const cleanNumber = number.replace(/[^0-9]/g, '');
            if (!cleanNumber.startsWith('254') || cleanNumber.length < 10) {
                return { error: 'Invalid number' };
            }

            // Create session folder
            const sessionId = Date.now().toString();
            const sessionFolder = path.join('./sessions', sessionId);
            if (!fs.existsSync('./sessions')) {
                fs.mkdirSync('./sessions', { recursive: true });
            }
            if (!fs.existsSync(sessionFolder)) {
                fs.mkdirSync(sessionFolder, { recursive: true });
            }

            const { state, saveCreds } = await useMultiFileAuthState(sessionFolder);
            
            const sock = makeWASocket({
                auth: state,
                printQRInTerminal: false,
                browser: ['QUEEN BELLA MD', 'Chrome', '1.0.1'],
                markOnlineOnConnect: false,
                syncFullHistory: false,
                downloadHistory: false,
            });

            sock.ev.on('creds.update', saveCreds);

            let pairCode = null;

            sock.ev.on('connection.update', async (update) => {
                const { connection } = update;

                if (connection === 'open' && !pairCode) {
                    try {
                        const code = await sock.requestPairingCode(cleanNumber);
                        pairCode = code.match(/.{1,4}/g)?.join('-') || code;
                        
                        // Store session info
                        global.pairSessions[pairCode] = {
                            number: cleanNumber,
                            sessionFolder: sessionFolder,
                            sock: sock,
                            createdAt: Date.now()
                        };

                        console.log(`✅ Pair code generated: ${pairCode} for ${cleanNumber}`);
                    } catch (error) {
                        console.error('Error generating pair code:', error);
                    }
                }
            });

            // Wait for code (max 30 seconds)
            let attempts = 0;
            while (!pairCode && attempts < 30) {
                await new Promise(resolve => setTimeout(resolve, 1000));
                attempts++;
            }

            if (pairCode) {
                return { success: true, code: pairCode, number: cleanNumber };
            } else {
                return { error: 'Failed to generate code' };
            }

        } catch (error) {
            console.error('Error in pair API:', error);
            return { error: error.message };
        }
    }
};