/**
 * 👑 QUEEN BELLA MD - ULTIMATE GHOST MODE
 * Reads messages but shows ONLY ONE TICK (✓)
 * ✅ EVERYONE CAN USE
 */

const settings = require('../settings');

if (global.ghostMode === undefined) {
    global.ghostMode = true;
}

module.exports = {
    name: 'ghostmode',
    aliases: ['gm', 'ghost', 'invisible', 'onetick', 'stealth'],
    category: 'features',
    description: 'ULTIMATE GHOST MODE - Read without ANY delivery ticks',
    usage: '.ghostmode on/off',
    react: '👻',
    async execute(conn, mek, args, chatId, isOwner) {
        try {
            await conn.sendMessage(chatId, {
                react: { text: '👻', key: mek.key }
            });

            // ✅ REMOVED OWNER CHECK - EVERYONE CAN USE!

            const action = args[0]?.toLowerCase();

            if (action === 'on') {
                global.ghostMode = true;
                await conn.sendMessage(chatId, {
                    text: `👻 *ULTIMATE GHOST MODE ACTIVATED!*

✅ Bot reads EVERYTHING
❌ Shows ONLY ONE TICK (✓) - NEVER delivers!
❌ NO double ticks (✓✓)
❌ NO blue ticks
❌ NO "online" status
❌ NO "typing..." status

*They'll think their message never arrived!* 😈
*You see EVERYTHING. They see NOTHING.* 👻
*This is the ultimate stealth mode!* 🔥`
                });
            } else if (action === 'off') {
                global.ghostMode = false;
                await conn.sendMessage(chatId, {
                    text: `👻 *GHOST MODE DEACTIVATED!*

❌ Bot will now show normal delivery (✓✓) and read receipts.

*Your invisibility cloak has been removed!* 🧙‍♂️`
                });
            } else {
                const status = global.ghostMode ? '✅ ON' : '❌ OFF';
                await conn.sendMessage(chatId, {
                    text: `👻 *ULTIMATE GHOST MODE*

Status: ${status}

Usage: .ghostmode on/off`
                });
            }

        } catch (error) {
            console.error('Error in ghostmode:', error);
            await conn.sendMessage(chatId, {
                text: '❌ Error in ghost mode.'
            });
        }
    }
};