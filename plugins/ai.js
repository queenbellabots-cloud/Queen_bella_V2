/**
 * 👑 QUEEN BELLA MD - AI Chat
 * Chat with AI using external API
 */

const settings = require('../settings');
const axios = require('axios');

const REACTIONS = ['🤖', '🧠', '💡', '✨', '🌟', '🤔', '💭'];

const AI_API = 'https://apis.davidcyril.name.ng/ai/gemini-3-pro';

module.exports = {
    name: 'ai',
    aliases: ['chat', 'ask', 'gpt', 'gemini'],
    category: 'main',
    description: 'Chat with AI assistant',
    usage: '.ai <question>',
    react: '🤖',
    async execute(conn, mek, args, chatId, isOwner) {
        try {
            const sender = mek.key.participant || mek.key.remoteJid;
            const pushName = mek.pushName || 'User';
            
            if (!args.length) {
                await conn.sendMessage(chatId, {
                    react: { text: '❌', key: mek.key }
                });
                await conn.sendMessage(chatId, { 
                    text: `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   🤖 AI CHAT BOT              ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

❌ *No question provided!*

📝 *Usage:*
.ai <your question>

📌 *Examples:*
.ai Who are you?
.ai What is the meaning of life?
.ai Tell me a joke

${settings.footer}`
                });
                return;
            }

            const randomReact = REACTIONS[Math.floor(Math.random() * REACTIONS.length)];
            await conn.sendMessage(chatId, {
                react: { text: randomReact, key: mek.key }
            });

            const question = args.join(' ');

            // Send thinking message
            await conn.sendMessage(chatId, { 
                text: `🤔 *Thinking...*\n\n📝 *Question:* ${question}`
            });

            try {
                // Call AI API
                const response = await axios.post(AI_API, {
                    message: question,
                    name: pushName
                }, {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    timeout: 30000 // 30 seconds timeout
                });

                let reply = response.data?.reply || response.data?.response || response.data?.message || 'No response from AI.';
                
                // Clean up the response
                reply = reply.replace(/\*\*/g, '*').trim();

                const message = `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   🤖 AI RESPONSE             ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

📝 *Your Question:*
${question}

💭 *AI Answer:*
${reply}

⏰ *Time:* ${new Date().toLocaleString()}

${settings.footer}`;

                await conn.sendMessage(chatId, {
                    react: { text: '✅', key: mek.key }
                });
                await conn.sendMessage(chatId, {
                    text: message,
                    contextInfo: {
                        mentionedJid: [sender],
                        forwardingScore: 999,
                        isForwarded: true,
                        forwardedNewsletterMessageInfo: {
                            newsletterJid: settings.channelId,
                            newsletterName: settings.channelName,
                            serverMessageId: 1
                        }
                    }
                });

            } catch (error) {
                console.error('AI API Error:', error.message);
                
                let errorMsg = '❌ Error getting AI response.';
                if (error.response) {
                    errorMsg = `❌ API Error: ${error.response.status}\n${error.response.data?.message || 'Please try again.'}`;
                } else if (error.code === 'ECONNABORTED') {
                    errorMsg = '⏰ *Timeout!*\nThe AI service is taking too long. Please try again.';
                }

                await conn.sendMessage(chatId, {
                    react: { text: '❌', key: mek.key }
                });
                await conn.sendMessage(chatId, { 
                    text: `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   ❌ AI ERROR                ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

${errorMsg}

💡 *Tips:*
• Try again in a few seconds
• Make sure your question is clear
• Check if the AI service is online

${settings.footer}`
                });
            }

        } catch (error) {
            console.error('Error in AI command:', error);
            await conn.sendMessage(chatId, { 
                text: '❌ Error processing AI request.'
            });
        }
    }
};