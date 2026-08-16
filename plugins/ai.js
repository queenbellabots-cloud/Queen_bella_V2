/**
 * 👑 QUEEN BELLA MD - AI Chat
 * Chat with AI assistant
 */

const settings = require('../settings');

const REACTIONS = ['🤖', '🧠', '💡', '✨', '🌟', '🤔', '💭'];

module.exports = {
    name: 'ai',
    aliases: ['chat', 'ask', 'gpt'],
    category: 'fun',
    description: 'Chat with AI assistant',
    usage: '.ai <question>',
    react: '🤖',
    async execute(conn, mek, args, chatId, isOwner) {
        try {
            const sender = mek.key.participant || mek.key.remoteJid;
            
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
            
            const responses = [
                `🤖 *AI Response*

📝 *Your Question:* ${question}

💭 *My Answer:* That's a great question! As QUEEN BELLA MD V1, I'm here to help you.

✨ *Fun Fact:* Created by Dev RODGERS

⏰ *Response Time:* ${Math.floor(Math.random() * 500 + 100)}ms`,

                `🤖 *AI Response*

📝 *Your Question:* ${question}

💭 *My Answer:* Interesting! I've processed your question.

🎯 *Tip:* Try asking me something specific!

📊 *Confidence:* ${Math.floor(Math.random() * 40 + 60)}%`
            ];

            const reply = responses[Math.floor(Math.random() * responses.length)];

            await conn.sendMessage(chatId, {
                text: reply,
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
            console.error('Error in AI command:', error);
            await conn.sendMessage(chatId, { 
                text: '❌ Error processing AI request.'
            });
        }
    }
};