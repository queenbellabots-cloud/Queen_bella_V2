/**
 * 👑 QUEEN BELLA MD - Auto Status Handler
 * Handles automatic status viewing and reacting
 */

const settings = require('../settings');

// Get reaction emojis from settings
const REACTION_EMOJIS = settings.statusReactions || [
    '🔥', '❤️', '😍', '👑', '✨', '🌟', '💯', '🎉', '💪', '👏',
    '🙌', '🤩', '😎', '💥', '⭐', '🌈', '🎊', '🎈', '💖', '💗',
    '💝', '💟', '❣️', '💕', '💞', '💓', '🧡', '💛', '💚', '💙',
    '💜', '🖤', '🤍', '🤎', '❤️‍🔥', '💘', '💌', '💋', '🫶', '💫'
];

async function handleStatusUpdate(conn, chatUpdate) {
    try {
        const mek = chatUpdate.messages[0];
        if (!mek) return;

        // Check if auto-view is enabled
        const autoView = global.autoStatusFlags?.view !== undefined ? global.autoStatusFlags.view : true;
        const autoReact = global.autoStatusFlags?.react !== undefined ? global.autoStatusFlags.react : true;

        // 👁️ VIEW STATUS
        if (autoView) {
            try {
                await conn.readMessages([mek.key]);
                console.log('✅ Status viewed automatically');
            } catch (viewError) {
                console.error('Error viewing status:', viewError);
            }
        }

        // ❤️ REACT TO STATUS
        if (autoReact) {
            try {
                // Pick random emoji from settings
                const randomEmoji = REACTION_EMOJIS[Math.floor(Math.random() * REACTION_EMOJIS.length)];
                
                // Get the status poster
                const poster = mek.key.participant || mek.key.remoteJid;
                
                // React to the status
                await conn.sendMessage(mek.key.remoteJid, {
                    react: { text: randomEmoji, key: mek.key }
                });
                
                console.log(`✅ Reacted with ${randomEmoji} to status from ${poster}`);
            } catch (reactError) {
                console.error('Error reacting to status:', reactError);
            }
        }

    } catch (error) {
        console.error('Error in status update:', error);
    }
}

module.exports = { handleStatusUpdate };