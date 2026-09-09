/**
 * 👑 QUEEN BELLA MD - Fake Typing/Recording
 * Uses custom status text from .setstatus
 * ✅ EVERYONE CAN USE
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

            // ✅ REMOVED OWNER CHECK - EVERYONE CAN USE!

            const action = args[0]?.toLowerCase();

            if (action === 'on') {
                global.fakeTyping = true;
                const statusText = global.customStatus || 'composing';
                
                await conn.sendMessage(chatId, {
                    text: `🎭 *FAKE TYPING ACTIVATED!*

✅ Bot will randomly show: *"${statusText}"*
✅ Sometimes "recording..."
✅ Sometimes "paused..."

*They'll see "${statusText}" randomly!* 😈
*Set custom text with: .setstatus <text>*`
                });

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