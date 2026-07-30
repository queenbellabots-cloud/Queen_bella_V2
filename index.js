/**
 * 👑 QUEEN BELLA MD - A WhatsApp Bot
 * Copyright (c) 2026 𝐑𝐎𝐃𝐆𝐄𝐑𝐒 𝐎𝐍𝐘𝐀𝐍𝐆𝐎
 * Created by Dev RODGERS
 */

const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('👑 QUEEN BELLA MD - WhatsApp Bot is Online!');
});

app.listen(PORT, () => {
    console.log(`🌐 Web server running on port ${PORT}`);
});

// Environment setup
process.env.PUPPETEER_SKIP_DOWNLOAD = 'true';
process.env.PUPPETEER_SKIP_CHROMIUM_DOWNLOAD = 'true';

// Dependencies
require('./settings');
const fs = require('fs');
const chalk = require('chalk');
const path = require('path');
const axios = require('axios');
const zlib = require('zlib');
const os = require('os');
const { handleMessages, handleGroupParticipantUpdate } = require('./main');
const { handleStatusUpdate } = require('./plugins/autostatus');
const PhoneNumber = require('awesome-phonenumber');
const { smsg, getBuffer, sleep } = require('./lib/myfunc');

const {
    default: makeWASocket,
    useMultiFileAuthState,
    DisconnectReason,
    fetchLatestBaileysVersion,
    makeCacheableSignalKeyStore,
    delay,
    jidNormalizedUser,
    jidDecode
} = require("@whiskeysockets/baileys");

const NodeCache = require("node-cache");
const pino = require("pino");
const readline = require("readline");
const { rmSync } = require('fs');

// Command loader
global.commands = new Map();

function loadCommands() {
    const commandsDir = path.join(process.cwd(), 'plugins');
    if (!fs.existsSync(commandsDir)) {
        fs.mkdirSync(commandsDir, { recursive: true });
    }
    const files = fs.readdirSync(commandsDir).filter(file => file.endsWith('.js'));
    console.log(chalk.red.bold(`\n📦 Loading QUEEN BELLA MD Commands...`));
    global.commands.clear();

    for (const file of files) {
        try {
            const filePath = path.join(commandsDir, file);
            delete require.cache[require.resolve(filePath)];
            const command = require(filePath);
            if (command.name) {
                global.commands.set(command.name.toLowerCase(), command);
                if (command.aliases && Array.isArray(command.aliases)) {
                    command.aliases.forEach(alias => {
                        global.commands.set(alias.toLowerCase(), command);
                    });
                }
            }
        } catch (error) {
            console.error(chalk.red(`❌ Failed to load ${file}:`), error);
        }
    }
    console.log(chalk.green(`✅ Loaded ${global.commands.size} commands successfully.`));
}

// Store & Settings
const store = require('./lib/lightweight_store');
store.readFromFile();
const settings = require('./settings');
setInterval(() => store.writeToFile(), settings.storeWriteInterval || 10000);

// Processed messages cache
const processedMessages = new Set();
setInterval(() => processedMessages.clear(), 5 * 60 * 1000);

// Memory management
setInterval(() => {
    if (global.gc) global.gc();
}, 60000);

setInterval(() => {
    const used = process.memoryUsage().rss / 1024 / 1024;
    if (used > 400) {
        console.log('⚠️ RAM too high, restarting...');
        process.exit(1);
    }
}, 30000);

// Global bot identity
global.botname = "👑 QUEEN BELLA MD 👑";
global.themeemoji = "👑";

// Pairing code setup - USE SETTINGS
const useMobile = process.argv.includes("--mobile");
const pairingCode = settings.usePairingCode !== undefined ? settings.usePairingCode : true;

const rl = process.stdin.isTTY ? readline.createInterface({ input: process.stdin, output: process.stdout }) : null;
const question = (text) => {
    if (rl) return new Promise((resolve) => rl.question(text, resolve));
    return Promise.resolve(settings.ownerNumber || '254755660053');
};

const isSystemJid = (jid) => {
    if (!jid) return true;
    if (jid === 'status@broadcast') return false;
    return jid.includes('@broadcast') || jid.includes('@newsletter');
};

// Main bot function
async function startQueenBella() {
    try {
        loadCommands();

        const sessionFolder = './session';
        if (!fs.existsSync(sessionFolder)) {
            fs.mkdirSync(sessionFolder, { recursive: true });
        }
        const sessionFile = path.join(sessionFolder, 'creds.json');

        // Handle session ID
        if (settings.sessionID && settings.sessionID.startsWith('QueenBella!')) {
            try {
                const [header, b64data] = settings.sessionID.split('!');
                if (header === 'QueenBella' && b64data) {
                    const cleanB64 = b64data.replace('...', '');
                    const compressedData = Buffer.from(cleanB64, 'base64');
                    const decompressedData = zlib.gunzipSync(compressedData);
                    fs.writeFileSync(sessionFile, decompressedData, 'utf8');
                    console.log('📡 Session restored from token');
                }
            } catch (e) {
                console.error('Session parsing failed:', e.message);
            }
        }

        let { version } = await fetchLatestBaileysVersion();
        const { state, saveCreds } = await useMultiFileAuthState(sessionFolder);
        const msgRetryCounterCache = new NodeCache();

        const QueenBella = makeWASocket({
            version,
            logger: pino({ level: 'silent' }),
            printQRInTerminal: !pairingCode,
            browser: ["Ubuntu", "Chrome", "20.0.04"],
            auth: {
                creds: state.creds,
                keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" }).child({ level: "fatal" })),
            },
            markOnlineOnConnect: false,
            syncFullHistory: false,
            downloadHistory: false,
            generateHighQualityLinkPreview: true,
            getMessage: async (key) => {
                let jid = jidNormalizedUser(key.remoteJid);
                let msg = await store.loadMessage(jid, key.id);
                return msg?.message || "";
            },
            msgRetryCounterCache,
            defaultQueryTimeoutMs: 60000,
            connectTimeoutMs: 60000,
            keepAliveIntervalMs: 10000,
        });

        QueenBella.ev.on('creds.update', saveCreds);
        store.bind(QueenBella.ev);

        let lastActivity = Date.now();
        const INACTIVITY_TIMEOUT = 30 * 60 * 1000;

        const watchdogInterval = setInterval(async () => {
            if (Date.now() - lastActivity > INACTIVITY_TIMEOUT && QueenBella.ws?.readyState === 1) {
                console.log('⚠️ Dead socket, reconnecting...');
                await QueenBella.end(undefined, undefined, { reason: 'inactive' });
                clearInterval(watchdogInterval);
                setTimeout(() => startQueenBella(), 5000);
            }
        }, 5 * 60 * 1000);

        // Message handler
        QueenBella.ev.on('messages.upsert', async chatUpdate => {
            try {
                if (chatUpdate.type !== 'notify') return;
                const mek = chatUpdate.messages[0];
                if (!mek || !mek.message || !mek.key?.id) return;

                const chatId = mek.key.remoteJid;
                const time = new Date().toLocaleTimeString();

                // Status handling
                if (chatId === 'status@broadcast') {
                    const poster = mek.key.participant || mek.participant || 'Unknown';
                    const posterNumber = poster.split('@')[0];
                    let posterName = 'Unknown User';
                    try {
                        posterName = await QueenBella.getName(poster) || mek.pushName || `+${posterNumber}`;
                    } catch (e) {
                        posterName = mek.pushName || `+${posterNumber}`;
                    }
                    console.log(chalk.yellowBright(`\n📱 Status from ${posterName} at ${time}`));
                    await handleStatusUpdate(QueenBella, chatUpdate);
                    return;
                }

                if (!chatId || isSystemJid(chatId)) return;
                if (processedMessages.has(mek.key.id)) return;

                if (mek.messageTimestamp) {
                    const messageAge = Date.now() - (mek.messageTimestamp * 1000);
                    if (messageAge > 5 * 60 * 1000) return;
                }

                processedMessages.add(mek.key.id);
                lastActivity = Date.now();

                mek.message = (Object.keys(mek.message)[0] === 'ephemeralMessage') ? 
                    mek.message.ephemeralMessage.message : mek.message;

                if (!QueenBella.public && !mek.key.fromMe) return;
                if (mek.key.id.startsWith('BAE5') && mek.key.id.length === 16) return;
                if (QueenBella?.msgRetryCounterCache) QueenBella.msgRetryCounterCache.clear();

                handleMessages(QueenBella, chatUpdate, true).catch(err => {
                    if (!err.message?.includes('rate-overlimit')) 
                        console.error("Error:", err.message);
                });

                setImmediate(async () => {
                    if (settings.autoRead && chatId.endsWith('@g.us')) {
                        try { await QueenBella.readMessages([mek.key]); } catch (e) {}
                    }
                });

            } catch (err) {
                console.error("Error in messages:", err);
            }
        });

        // Utility functions
        QueenBella.decodeJid = (jid) => {
            if (!jid) return jid;
            if (/:\d+@/gi.test(jid)) {
                let decode = jidDecode(jid) || {};
                return decode.user && decode.server && decode.user + '@' + decode.server || jid;
            }
            return jid;
        };

        QueenBella.getName = (jid, withoutContact = false) => {
            let id = QueenBella.decodeJid(jid);
            withoutContact = QueenBella.withoutContact || withoutContact;
            let v;
            if (id.endsWith("@g.us")) return new Promise(async (resolve) => {
                v = store.contacts[id] || {};
                if (!(v.name || v.subject)) v = QueenBella.groupMetadata(id) || {};
                resolve(v.name || v.subject || PhoneNumber('+' + id.replace('@s.whatsapp.net', '')).getNumber('international'));
            });
            else v = id === '0@s.whatsapp.net' ? { id, name: 'WhatsApp' } : 
                id === QueenBella.decodeJid(QueenBella.user.id) ? QueenBella.user : 
                (store.contacts[id] || {});
            return (withoutContact ? '' : v.name) || v.subject || v.verifiedName || 
                PhoneNumber('+' + jid.replace('@s.whatsapp.net', '')).getNumber('international');
        };

        QueenBella.public = true;
        QueenBella.serializeM = (m) => smsg(QueenBella, m, store);

        // Pairing code generation - FIXED VERSION
        let pairingDone = false;
        QueenBella.ev.on('connection.update', async (s) => {
            const { connection, lastDisconnect, qr } = s;

            if (pairingCode && !QueenBella.authState.creds.registered && !pairingDone) {
                if (connection === 'connecting' || connection === 'open') {
                    pairingDone = true;
                    if (useMobile) throw new Error('Cannot use pairing code with mobile API');

                    // Use number from settings
                    let phoneNumber = settings.ownerNumber || '254755660053';
                    phoneNumber = String(phoneNumber).replace(/[^0-9]/g, '');
                    
                    console.log(chalk.green(`📱 Using phone number: ${phoneNumber}`));
                    console.log(chalk.yellow(`⏳ Requesting pairing code...`));

                    setTimeout(async () => {
                        try {
                            let code = await QueenBella.requestPairingCode(phoneNumber);
                            code = code?.match(/.{1,4}/g)?.join("-") || code;
                            console.log(chalk.black(chalk.bgGreen(`✅ Pairing Code: `)), chalk.black(chalk.white(code)));
                            console.log(chalk.yellow(`📱 Enter this code in WhatsApp Web/Linked Devices`));
                        } catch (error) {
                            console.error(chalk.red('❌ Error getting pairing code:'), error);
                            console.log(chalk.red(`💡 Make sure:`));
                            console.log(chalk.red(`   - The number ${phoneNumber} is correct`));
                            console.log(chalk.red(`   - WhatsApp is installed on that number`));
                            console.log(chalk.red(`   - You have internet connection`));
                            console.log(chalk.yellow(`🔄 Retrying in 10 seconds...`));
                            pairingDone = false;
                            setTimeout(() => {
                                if (!QueenBella.authState.creds.registered) {
                                    startQueenBella();
                                }
                            }, 10000);
                        }
                    }, 5000);
                }
            }

            // Only show QR if pairing is disabled
            if (qr && !pairingCode) console.log(chalk.yellow('📱 QR Code generated.'));
            if (connection === 'connecting') console.log(chalk.yellow('🔄 Connecting...'));

            if (connection === "open") {
                console.clear();
                console.log(chalk.magenta.bold(`
    ╔══════════════════════════════════╗
    ║      👑 QUEEN BELLA MD 👑      ║
    ║    Created by Dev RODGERS       ║
    ╚══════════════════════════════════╝
                `));
                console.log(chalk.magenta.bold(`    [ QUEEN BELLA MD is Online! ]\n`));
                console.log(chalk.cyan(`< ================================== >`));
                console.log(chalk.magenta(`👑 BOT NAME  : QUEEN BELLA MD`));
                console.log(chalk.magenta(`👑 OWNER     : 𝐑𝐎𝐃𝐆𝐄𝐑𝐒 𝐎𝐍𝐘𝐀𝐍𝐆𝐎`));
                console.log(chalk.magenta(`👑 DEVELOPER : 𝐑𝐎𝐃𝐆𝐄𝐑𝐒 𝐎𝐍𝐘𝐀𝐍𝐆𝐎`));
                console.log(chalk.green(`👑 STATUS    : Connected! ✅`));
                console.log(chalk.cyan(`< ================================== >\n`));

                try {
                    const botNumber = QueenBella.user.id.split(':')[0] + '@s.whatsapp.net';
                    const rawBotNumber = QueenBella.user.id.split(':')[0];
                    const currentPrefix = settings.prefix || '.';

                    const connectMessage = `*👑 QUEEN BELLA MD CONNECTED!*\n\n` +
                        `⏰ *Time:* ${new Date().toLocaleString()}\n` +
                        `⚡ *Prefix:* ${currentPrefix}\n` +
                        `👑 *Owner:* ${rawBotNumber}\n` +
                        `👨‍💻 *Developer:* 𝐑𝐎𝐃𝐆𝐄𝐑𝐒 𝐎𝐍𝐘𝐀𝐍𝐆𝐎\n` +
                        `✅ *Status:* Online and Ready!\n\n` +
                        `> © MADE BY RODGERS`;

                    await QueenBella.sendMessage(botNumber, { 
                        text: connectMessage,
                        contextInfo: {
                            forwardingScore: 1,
                            isForwarded: true,
                            forwardedNewsletterMessageInfo: {
                                newsletterJid: '120363423209691396@newsletter',
                                newsletterName: '👑 QUEEN BELLA MD 👑',
                                serverMessageId: -1
                            }
                        }
                    });
                } catch (error) {
                    console.error('Error sending welcome message:', error.message);
                }
            }

            if (connection === 'close') {
                clearInterval(watchdogInterval);
                const statusCode = lastDisconnect?.error?.output?.statusCode || 
                    lastDisconnect?.error?.statusCode;
                const shouldReconnect = statusCode !== DisconnectReason.loggedOut;

                if (statusCode === 515 || statusCode === 503 || statusCode === 408) {
                    console.log(chalk.yellow(`⚠️ Stream down (${statusCode}). Reconnecting...`));
                } else {
                    console.log(chalk.red(`Connection closed. Status: ${statusCode}`));
                }

                if (statusCode === DisconnectReason.loggedOut) {
                    try {
                        rmSync(sessionFolder, { recursive: true, force: true });
                        console.log(chalk.yellow('Session cleared. Please re-authenticate.'));
                    } catch (e) {}
                }

                if (shouldReconnect) {
                    await delay(3000);
                    startQueenBella();
                }
            }
        });

        // Anti-call
        QueenBella.ev.on('call', async (calls) => {
            try {
                const { readState } = require('./plugins/anticall');
                if (!readState().enabled) return;
                for (const call of calls) {
                    if (!call.from) continue;
                    await QueenBella.sendMessage(call.from, { 
                        text: '👑 QUEEN BELLA MD - Calls are auto-rejected.' 
                    });
                }
            } catch (e) {}
        });

        // Group participants
        QueenBella.ev.on('group-participants.update', async (update) => {
            await handleGroupParticipantUpdate(QueenBella, update);
        });

        return QueenBella;
    } catch (error) {
        console.error('Error starting bot:', error);
        await delay(5000);
        startQueenBella();
    }
}

// Error handlers
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (err) => {
    if (err.message && err.message.includes('rate-overlimit')) return;
    console.error('Unhandled Rejection:', err);
});

// Start the bot
startQueenBella().catch(error => {
    console.error('Fatal crash:', error);
    process.exit(1);
});