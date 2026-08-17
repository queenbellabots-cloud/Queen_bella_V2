/**
 * 👑 QUEEN BELLA MD - Calculator
 * Calculate math expressions
 */

const settings = require('../settings');

module.exports = {
    name: 'calc',
    aliases: ['calculate', 'math'],
    category: 'tools',
    description: 'Calculate math expressions',
    usage: '.calc <expression>',
    react: '🧮',
    async execute(conn, mek, args, chatId, isOwner) {
        try {
            const sender = mek.key.participant || mek.key.remoteJid;
            
            if (!args.length) {
                await conn.sendMessage(chatId, {
                    react: { text: '❌', key: mek.key }
                });
                await conn.sendMessage(chatId, { 
                    text: `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   🧮 CALCULATOR             ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

❌ *No expression provided!*

📝 *Usage:*
.calc <expression>

📌 *Examples:*
.calc 2 + 2
.calc 10 * 5
.calc (100 / 4) + 10

${settings.footer}`
                });
                return;
            }

            const expression = args.join(' ');
            
            // Security: Only allow safe characters
            const safeExpr = expression.replace(/[^0-9+\-*/().% ]/g, '');
            
            if (!safeExpr) {
                await conn.sendMessage(chatId, {
                    react: { text: '❌', key: mek.key }
                });
                await conn.sendMessage(chatId, { 
                    text: '❌ Invalid expression!'
                });
                return;
            }

            let result;
            try {
                // Use Function constructor for safe evaluation
                result = new Function(`return (${safeExpr})`)();
            } catch (e) {
                await conn.sendMessage(chatId, {
                    react: { text: '❌', key: mek.key }
                });
                await conn.sendMessage(chatId, { 
                    text: '❌ Invalid math expression!'
                });
                return;
            }

            if (result === undefined || result === null || !isFinite(result)) {
                await conn.sendMessage(chatId, {
                    react: { text: '❌', key: mek.key }
                });
                await conn.sendMessage(chatId, { 
                    text: '❌ Invalid result!'
                });
                return;
            }

            await conn.sendMessage(chatId, {
                react: { text: '✅', key: mek.key }
            });

            const message = `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   🧮 CALCULATOR RESULT      ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

📝 *Expression:*
${safeExpr}

✅ *Result:*
${result}

${settings.footer}`;

            await conn.sendMessage(chatId, {
                text: message,
                contextInfo: {
                    mentionedJid: [sender]
                }
            });

        } catch (error) {
            console.error('Error in calc:', error);
            await conn.sendMessage(chatId, { 
                text: '❌ Error calculating.'
            });
        }
    }
};