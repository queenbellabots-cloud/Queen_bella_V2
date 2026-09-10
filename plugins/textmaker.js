/**
 * 👑 QUEEN BELLA MD - Text Maker Commands
 * All text effect commands with MULTI-API FALLBACK
 * ✅ EVERYONE CAN USE
 * ✅ APPEARS IN MENU
 */

const settings = require('../settings');
const axios = require('axios');

// ==========================================
// 📌 API CONFIGURATION
// ==========================================

const API_SOURCES = [
    {
        name: 'GiftedTech',
        base: 'https://api.giftedtech.xyz/api/textpro',
        params: (effect, text) => ({ text: text })
    },
    {
        name: 'NexOrcale',
        base: 'https://api.nexoracle.com/textpro',
        params: (effect, text) => ({ text: text })
    },
    {
        name: 'Popkid',
        base: 'https://api.popkid.xyz/api/textpro',
        params: (effect, text) => ({ text: text })
    },
    {
        name: 'BellaX',
        base: 'https://api.bellax.xyz/textpro',
        params: (effect, text) => ({ text: text })
    }
];

// ==========================================
// 🎨 TEXT EFFECTS LIST
// ==========================================

const EFFECTS = [
    'luxurygold', 'advancedglow', 'blackpinklogo', 'blackpinkstyle',
    'cartoonstyle', 'deadpool', 'effectclouds', 'flagtext',
    'freecreate', 'galaxystyle', 'galaxywallpaper', 'makingneon',
    'matrixfx', 'royaltext', 'sandfx', 'summerbeach',
    'topography', 'typography', 'flag3dtext', 'glitchtext',
    'dragonball', 'multicoloredneon', 'neonglitch', 'papercutstyle',
    'pixelglitch', 'glowingtext', 'gradienttext', 'graffiti',
    'incandescent', 'lighteffects', 'logomaker', 'royal',
    'textonwetglass', 'bear', 'papercut', 'hologram',
    '1917', 'arena', 'devil', 'fire',
    'glitch', 'hacker', 'ice', 'impressive',
    'leaves', 'light', 'matrix', 'metallic',
    'neon', 'purple', 'sand', 'snow', 'thunder'
];

// ==========================================
// 🚀 FETCH FUNCTION
// ==========================================

async function fetchWithFallback(effect, text) {
    let lastError = null;
    
    for (const api of API_SOURCES) {
        try {
            const url = `${api.base}/${effect}`;
            const params = api.params(effect, text);
            
            const response = await axios.get(url, {
                params: params,
                timeout: 15000,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                }
            });

            if (response.data && response.data.result) {
                return { success: true, imageUrl: response.data.result };
            }
            
            if (response.data && response.data.image) {
                return { success: true, imageUrl: response.data.image };
            }
            
            if (response.data && response.data.url) {
                return { success: true, imageUrl: response.data.url };
            }
            
            if (response.data && Buffer.isBuffer(response.data)) {
                return { success: true, imageBuffer: response.data };
            }

            if (response.data && typeof response.data === 'string' && response.data.startsWith('data:image')) {
                const base64Data = response.data.replace(/^data:image\/\w+;base64,/, '');
                const imageBuffer = Buffer.from(base64Data, 'base64');
                return { success: true, imageBuffer: imageBuffer };
            }

            throw new Error('No valid image data from API');

        } catch (error) {
            console.log(`⚠️ API ${api.name} failed for ${effect}:`, error.message);
            lastError = error;
            continue;
        }
    }

    throw new Error(`All APIs failed: ${lastError?.message || 'Unknown error'}`);
}

// ==========================================
// 📦 COMMAND EXECUTOR
// ==========================================

async function executeTextEffect(conn, mek, args, chatId, effect) {
    try {
        const text = args.join(' ');
        if (!text) {
            await conn.sendMessage(chatId, {
                text: `✨ *${effect.toUpperCase()} TEXT EFFECT*

❌ Please provide text.

📋 *Usage:* .${effect} <text>
📌 *Example:* .${effect} QUEEN BELLA

© A BELLA BOTS PRODUCTIONS`
            });
            return;
        }

        await conn.sendMessage(chatId, {
            react: { text: '⏳', key: mek.key }
        });

        const result = await fetchWithFallback(effect, text);

        const caption = `✨ *${effect.toUpperCase()} TEXT EFFECT*

📌 *Text:* ${text}
👤 *Requested by:* ${mek.pushName || 'User'}

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  📢 JOIN OUR CHANNEL         ┃
┃  👇 Click the button below    ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

${settings.footer}`;

        let messageOptions = {
            caption: caption,
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: settings.channelId,
                    newsletterName: settings.channelName,
                    serverMessageId: 1
                }
            }
        };

        if (result.imageBuffer) {
            messageOptions.image = result.imageBuffer;
        } else if (result.imageUrl) {
            messageOptions.image = { url: result.imageUrl };
        } else {
            throw new Error('No image data received');
        }

        await conn.sendMessage(chatId, messageOptions);

    } catch (error) {
        console.error(`Error in ${effect}:`, error);
        await conn.sendMessage(chatId, {
            react: { text: '❌', key: mek.key }
        });
        
        await conn.sendMessage(chatId, {
            text: `❌ Error creating ${effect} text.\n\n📌 Please try again later or use a different effect.\n\n${settings.footer}`
        });
    }
}

// ==========================================
// 📦 GENERATE COMMANDS - EACH AS SEPARATE
// ==========================================

const commands = {};

// Create a command for each effect
EFFECTS.forEach(effect => {
    commands[effect] = {
        name: effect,
        aliases: [effect],
        category: 'textmaker',
        description: `✨ Create ${effect} text effect`,
        usage: `.${effect} <text>`,
        react: '✨',
        async execute(conn, mek, args, chatId, isOwner) {
            await executeTextEffect(conn, mek, args, chatId, effect);
        }
    };
});

// ==========================================
// 📋 HELP COMMAND FOR TEXTMAKER
// ==========================================

commands['textmakerhelp'] = {
    name: 'textmakerhelp',
    aliases: ['tmhelp', 'texteffects'],
    category: 'textmaker',
    description: '📋 Show all text effect commands',
    usage: '.textmakerhelp',
    react: '📋',
    async execute(conn, mek, args, chatId, isOwner) {
        try {
            await conn.sendMessage(chatId, {
                react: { text: '📋', key: mek.key }
            });

            let message = `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   👑 QUEEN BELLA MD V1   ┃
┃   Created by Dev RODGERS  ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

📋 *TEXT EFFECT COMMANDS*

📌 *Total Effects:* ${EFFECTS.length}

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  🎨 AVAILABLE EFFECTS        ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛\n`;

            // Show in columns
            const cols = 3;
            const rows = Math.ceil(EFFECTS.length / cols);
            for (let i = 0; i < rows; i++) {
                let line = '';
                for (let j = 0; j < cols; j++) {
                    const index = i + (j * rows);
                    if (index < EFFECTS.length) {
                        line += `• .${EFFECTS[index].padEnd(15)}`;
                    }
                }
                message += line + '\n';
            }

            message += `\n📌 *Usage:* .<effect> <text>
📌 *Example:* .fire QUEEN BELLA

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  📢 JOIN OUR CHANNEL         ┃
┃  👇 Click the button below    ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

${settings.footer}`;

            await conn.sendMessage(chatId, { text: message });

        } catch (error) {
            console.error('Error in textmakerhelp:', error);
            await conn.sendMessage(chatId, {
                text: '❌ Error loading text maker help.'
            });
        }
    }
};

// ==========================================
// 📦 EXPORT ALL COMMANDS
// ==========================================

module.exports = commands;