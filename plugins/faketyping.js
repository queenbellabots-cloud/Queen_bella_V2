/**
 * 👑 QUEEN BELLA MD - Fake Typing/Recording
 * Uses custom status text from .setstatus
 */

const settings = require('../settings');

if (global.fakeTyping === undefined) {
    global.fakeTyping = true;
}

module.exports = {
    name: 'faketyping',
    aliases: ['ft', 'faketype', 'prank'],
    category: 'features',
    description: 'Toggle fake typing/recording (uses custom status)',
    usage: '.faketyping on/off',
    react: '🎭',
    async execute(conn, mek, args, chatId, isOwner) {
        try {
            await conn.sendMessage(chatId, {
                react: { text: '🎭', key: mek.key }
            });

            if (!isOwner) {
                await conn.sendMessage(chatId, {
                    text: '❌ Only the bot owner can use this.'
                });
                return;
            }

            const action = args[0]?.toLowerCase();

            if (action === 'on') {
                global.fakeTyping = true;
                
                // Start fake typing loop
                const statusText = global.customStatus || 'composing';
                
                await conn.sendMessage(chatId, {
                    text: `🎭 *FAKE TYPING ACTIVATED!*

✅ Bot will randomly show: *"${statusText}"*
✅ Sometimes "recording..."
✅ Sometimes "paused..."

*They'll see "${statusText}" randomly!* 😈
*Set custom text with: .setstatus <text>*`
                });

                // Start random typing
                const interval = setInterval(async () => {
                    if (!global.fakeTyping) {
                        clearInterval(interval);
                        return;
                    }

                    try {
                        // Get current custom status
                        const status = global.customStatus || 'composing';
                        const presences = [status, 'recording', 'paused'];
                        const randomPresence = presences[Math.floor(Math.random() * presences.length)];
                        
                        // Send to a random chat? Or just current
                        await conn.sendPresenceUpdate(randomPresence, chatId);
                        
                    } catch (e) {
                        // Silent
                    }
                }, Math.floor(Math.random() * 15000) + 10000); // 10-25 seconds

            } else if (action === 'off') {
                global.fakeTyping = false;
                await conn.sendMessage(chatId, {
                    text: `🎭 *FAKE TYPING DEACTIVATED!*`
                });
            } else {
                const status = global.fakeTyping ? '✅ ON' : '❌ OFF';
                const customStatus = global.customStatus || 'composing';
                await conn.sendMessage(chatId, {
                    text: `🎭 *FAKE TYPING*

Status: ${status}
Current Status Text: *"${customStatus}"*

Usage: .faketyping on/off
Set text: .setstatus <text>`
                });
            }

        } catch (error) {
            console.error('Error in faketyping:', error);
        }
    }
};