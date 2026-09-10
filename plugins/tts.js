/**
 * 👑 QUEEN BELLA MD - Text to Speech
 * Convert text to voice message
 */

const settings = require('../settings');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports = {
    name: 'tts',
    aliases: ['voice', 'speak'],
    category: 'tools',
    description: 'Convert text to voice message',
    usage: '.tts <text>',
    react: '🔊',
    async execute(conn, mek, args, chatId, isOwner) {
        try {
            const sender = mek.key.participant || mek.key.remoteJid;

            if (!args.length) {
                await conn.sendMessage(chatId, {
                    text: `🔊 *Text to Speech*\n\nUsage: .tts <text>\nExample: .tts Hello world`
                });
                return;
            }

            const text = args.join(' ');
            await conn.sendMessage(chatId, {
                react: { text: '🔊', key: mek.key }
            });

            // Use Google TTS (free)
            const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=en&client=tw-ob`;

            const response = await axios({
                method: 'get',
                url: ttsUrl,
                responseType: 'arraybuffer',
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
                },
                timeout: 15000
            });

            await conn.sendMessage(chatId, {
                audio: Buffer.from(response.data),
                mimetype: 'audio/mp4',
                ptt: true,
                caption: ''
            });

            console.log(`✅ TTS sent: ${text}`);

        } catch (error) {
            console.error('TTS error:', error);
            await conn.sendMessage(chatId, { text: '❌ Failed to generate voice.' });
        }
    }
};