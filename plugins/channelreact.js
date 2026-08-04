/**
 * 👑 QUEEN BELLA MD - Auto Channel React
 * Automatically reacts to messages in your channel
 */

const settings = require('../settings');

// ✅ CORRECT CHANNEL JID - UPDATED
const CHANNEL_ID = '120363411498601038@newsletter';

// Different reaction emojis to use (100+ unique emojis)
const REACTION_EMOJIS = [
    '🔥', '❤️', '😍', '👑', '✨', '🌟', '💯', '🎉', '💪', '👏', 
    '🙌', '🤩', '😎', '💥', '⭐', '🌈', '🎊', '🎈', '💖', '💗',
    '💝', '💟', '❣️', '💕', '💞', '💓', '🧡', '💛', '💚', '💙',
    '💜', '🖤', '🤍', '🤎', '❤️‍🔥', '❤️‍🩹', '💘', '💌', '💋', '🫶',
    '👍', '👎', '👊', '✊', '🤛', '🤜', '👏', '🙌', '👐', '🤲',
    '🤝', '🙏', '✌️', '🤟', '🤘', '👌', '🤌', '🤞', '🫰', '🫵',
    '😊', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '🥲', '☺️',
    '😌', '😉', '😋', '😛', '😝', '😜', '🤪', '🥳', '🤗', '🫡',
    '🤭', '🫢', '🫣', '🤫', '🤔', '🫤', '🤨', '🧐', '🤓', '😎',
    '🥸', '🤩', '🥰', '😍', '🤗', '😘', '😗', '😙', '😚', '☺️',
    '😇', '🥹', '😠', '😡', '🤬', '😤', '😈', '👿', '💀', '☠️',
    '💩', '🤡', '👹', '👺', '🦍', '🐶', '🐱', '🐭', '🐹', '🐰'
];

// Global toggle for auto-reaction
if (global.channelReact === undefined) {
    global.channelReact = {
        enabled: true,
        count: 1000 // Number of reactions per message
    };
}

module.exports = {
    name: 'channelreact',
    aliases: ['cr', 'autoreactchannel'],
    category: 'tools',
    description: 'Toggle auto-reaction to channel messages',
    usage: '.channelreact on/off',
    react: '🔥',
    async execute(conn, mek, args, chatId, isOwner) {
        try {
            // 👇 REACT WITH FIRE EMOJI
            await conn.sendMessage(chatId, {
                react: { text: '🔥', key: mek.key }
            });

            // ✅ REMOVED OWNER CHECK - EVERYONE CAN USE!

            const action = args[0]?.toLowerCase();

            if (action === 'on' || action === 'off') {
                global.channelReact.enabled = action === 'on';

                await conn.sendMessage(chatId, {
                    text: `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   👑 QUEEN BELLA MD V1   ┃
┃   Created by Dev RODGERS  ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

🔥 *AUTO CHANNEL REACT*

Status: ${global.channelReact.enabled ? '✅ ENABLED' : '❌ DISABLED'}

📌 Bot will ${global.channelReact.enabled ? 'now' : 'no longer'} react to your channel messages with ${global.channelReact.count} different reactions.

${settings.footer}`
                });
                return;
            }

            // Show current status
            await conn.sendMessage(chatId, {
                text: `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   👑 QUEEN BELLA MD V1   ┃
┃   Created by Dev RODGERS  ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

🔥 *AUTO CHANNEL REACT*

Status: ${global.channelReact.enabled ? '✅ ENABLED' : '❌ DISABLED'}
📊 Reactions per message: ${global.channelReact.count}

📌 To change: .channelreact on/off

${settings.footer}`
            });

        } catch (error) {
            console.error('Error in channelreact:', error);
            await conn.sendMessage(chatId, {
                react: { text: '❌', key: mek.key }
            });
            await conn.sendMessage(chatId, {
                text: '❌ Error in channel reaction command.'
            });
        }
    }
};