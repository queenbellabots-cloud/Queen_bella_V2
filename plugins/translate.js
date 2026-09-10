/**
 * 👑 QUEEN BELLA MD - Translator
 * Translate text between 100+ languages
 */

const settings = require('../settings');
const axios = require('axios');

module.exports = {
    name: 'translate',
    aliases: ['tr', 'trans'],
    category: 'tools',
    description: 'Translate text to any language',
    usage: '.translate <lang> <text>',
    react: '🌍',
    async execute(conn, mek, args, chatId, isOwner) {
        try {
            const sender = mek.key.participant || mek.key.remoteJid;

            if (args.length < 2) {
                await conn.sendMessage(chatId, {
                    text: `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   🌍 TRANSLATOR              ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

❌ *Missing arguments!*

📝 *Usage:*
.translate <language> <text>

📌 *Examples:*
.translate sw Hello my friend
.translate es Good morning
.translate fr Thank you

🌐 *Common codes:*
en=English, sw=Swahili, es=Spanish
fr=French, de=German, ar=Arabic
zh=Chinese, ja=Japanese, hi=Hindi

${settings.footer}`
                });
                return;
            }

            const targetLang = args[0].toLowerCase();
            const text = args.slice(1).join(' ');

            await conn.sendMessage(chatId, {
                react: { text: '🌍', key: mek.key }
            });

            // Use Google Translate free API
            const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
            const response = await axios.get(url, { timeout: 15000 });

            const translatedText = response.data[0].map(item => item[0]).filter(Boolean).join('');

            await conn.sendMessage(chatId, {
                text: `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   🌍 TRANSLATION             ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

📝 *Original:*
${text}

🌐 *Translated (${targetLang.toUpperCase()}):*
${translatedText}

${settings.footer}`,
                contextInfo: {
                    mentionedJid: [sender]
                }
            });

            console.log(`✅ Translated to ${targetLang}`);

        } catch (error) {
            console.error('Translate error:', error);
            await conn.sendMessage(chatId, { text: '❌ Translation failed.' });
        }
    }
};