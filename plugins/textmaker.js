/**
 * 👑 QUEEN BELLA MD - Text Maker Commands
 * All text effect commands with MULTI-API FALLBACK
 * ✅ EVERYONE CAN USE
 */

const settings = require('../settings');
const axios = require('axios');

// ==========================================
// 📌 API CONFIGURATION
// ==========================================

// Multiple APIs for each effect (will try in order)
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

const EFFECTS = {
    'luxurygold': 'luxurygold',
    'advancedglow': 'advancedglow',
    'blackpinklogo': 'blackpinklogo',
    'blackpinkstyle': 'blackpinkstyle',
    'cartoonstyle': 'cartoonstyle',
    'deadpool': 'deadpool',
    'effectclouds': 'effectclouds',
    'flagtext': 'flagtext',
    'freecreate': 'freecreate',
    'galaxystyle': 'galaxystyle',
    'galaxywallpaper': 'galaxywallpaper',
    'makingneon': 'makingneon',
    'matrixfx': 'matrixfx',
    'royaltext': 'royaltext',
    'sandfx': 'sandfx',
    'summerbeach': 'summerbeach',
    'topography': 'topography',
    'typography': 'typography',
    'flag3dtext': 'flag3dtext',
    'glitchtext': 'glitchtext',
    'dragonball': 'dragonball',
    'multicoloredneon': 'multicoloredneon',
    'neonglitch': 'neonglitch',
    'papercutstyle': 'papercutstyle',
    'pixelglitch': 'pixelglitch',
    'glowingtext': 'glowingtext',
    'gradienttext': 'gradienttext',
    'graffiti': 'graffiti',
    'incandescent': 'incandescent',
    'lighteffects': 'lighteffects',
    'logomaker': 'logomaker',
    'royal': 'royal',
    'textonwetglass': 'textonwetglass',
    'bear': 'bear',
    'papercut': 'papercut',
    'hologram': 'hologram',
    '1917': '1917',
    'arena': 'arena',
    'devil': 'devil',
    'fire': 'fire',
    'glitch': 'glitch',
    'hacker': 'hacker',
    'ice': 'ice',
    'impressive': 'impressive',
    'leaves': 'leaves',
    'light': 'light',
    'matrix': 'matrix',
    'metallic': 'metallic',
    'neon': 'neon',
    'purple': 'purple',
    'sand': 'sand',
    'snow': 'snow',
    'thunder': 'thunder'
};

// ==========================================
// 🚀 GENERATE COMMANDS
// ==========================================

const commands = {};

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

            // Check if response has image
            if (response.data && response.data.result) {
                return {
                    success: true,
                    imageUrl: response.data.result
                };
            }
            
            if (response.data && response.data.image) {
                return {
                    success: true,
                    imageUrl: response.data.image
                };
            }
            
            if (response.data && response.data.url) {
                return {
                    success: true,
                    imageUrl: response.data.url
                };
            }
            
            if (response.data && Buffer.isBuffer(response.data)) {
                return {
                    success: true,
                    imageBuffer: response.data
                };
            }

            if (response.data && typeof response.data === 'string' && response.data.startsWith('data:image')) {
                const base64Data = response.data.replace(/^data:image\/\w+;base64,/, '');
                const imageBuffer = Buffer.from(base64Data, 'base64');
                return {
                    success: true,
                    imageBuffer: imageBuffer
                };
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

// Generate commands for each effect
Object.keys(EFFECTS).forEach(effect => {
    commands[effect] = {
        name: effect,
        aliases: [effect],
        category: 'textmaker',
        description: `Create ${effect} text effect`,
        usage: `.${effect} <text>`,
        react: '✨',
        async execute(conn, mek, args, chatId, isOwner) {
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

                // Clean caption - NO API OWNER
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
    };
});

// ==========================================
// 📋 HELP COMMAND FOR TEXTMAKER
// ==========================================

commands['textmakerhelp'] = {
    name: 'textmakerhelp',
    aliases: ['tmhelp', 'texteffects'],
    category: 'textmaker',
    description: 'Show all text effect commands',
    usage: '.textmakerhelp',
    react: '📋',
    async execute(conn, mek, args, chatId, isOwner) {
        try {
            await conn.sendMessage(chatId, {
                react: { text: '📋', key: mek.key }
            });

            const effectNames = Object.keys(EFFECTS);
            let message = `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   👑 QUEEN BELLA MD V1   ┃
┃   Created by Dev RODGERS  ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

📋 *TEXT EFFECT COMMANDS*

📌 *Total Effects:* ${effectNames.length}

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  🎨 AVAILABLE EFFECTS        ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛\n`;

            // Group effects in columns
            let col1 = [], col2 = [], col3 = [];
            effectNames.forEach((name, i) => {
                if (i % 3 === 0) col1.push(name);
                else if (i % 3 === 1) col2.push(name);
                else col3.push(name);
            });

            const maxLen = Math.max(col1.length, col2.length, col3.length);
            for (let i = 0; i < maxLen; i++) {
                const c1 = col1[i] || '';
                const c2 = col2[i] || '';
                const c3 = col3[i] || '';
                message += `• .${c1}${c1 ? ' ' : ''}${c2 ? '• .' + c2 : ''}${c3 ? '• .' + c3 : ''}\n`;
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

// Export all commands
module.exports = commands;