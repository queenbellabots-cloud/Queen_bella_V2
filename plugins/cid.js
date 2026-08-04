/**
 * 👑 QUEEN BELLA MD - Get Channel ID
 * Get WhatsApp Channel info from link
 */

const settings = require('../settings');

module.exports = {
    name: 'cid',
    aliases: ['newsletter', 'id', 'channelid', 'cinfo'],
    category: 'tools',
    description: 'Get WhatsApp Channel info from link',
    usage: '.cid https://whatsapp.com/channel/xxxxx',
    react: '⏳',
    async execute(conn, mek, args, chatId, isOwner) {
        try {
            // 👇 REACT WITH HOURGLASS
            await conn.sendMessage(chatId, {
                react: { text: '⏳', key: mek.key }
            });

            const q = args.join(' ');

            if (!q) {
                await conn.sendMessage(chatId, {
                    text: `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   👑 QUEEN BELLA MD V1   ┃
┃   Created by Dev RODGERS  ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

📡 *CHANNEL INFO COMMAND*

❌ Please provide a WhatsApp Channel link.

📋 *Example:* .cid https://whatsapp.com/channel/0029VbCwZHACXC3PNHgtMT31

${settings.footer}`
                });
                return;
            }

            const match = q.match(/whatsapp\.com\/channel\/([\w-]+)/);
            if (!match) {
                await conn.sendMessage(chatId, {
                    text: '⚠️ *Invalid channel link format.*\n\nMake sure it looks like:\nhttps://whatsapp.com/channel/xxxxxxxxx'
                });
                return;
            }

            const inviteId = match[1];

            let metadata;
            try {
                metadata = await conn.newsletterMetadata('invite', inviteId);
            } catch (e) {
                await conn.sendMessage(chatId, {
                    text: '❌ Failed to fetch channel metadata. Make sure the link is correct.'
                });
                return;
            }

            if (!metadata || !metadata.id) {
                await conn.sendMessage(chatId, {
                    text: '❌ Channel not found or inaccessible.'
                });
                return;
            }

            const infoText = `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   👑 QUEEN BELLA MD V1   ┃
┃   Created by Dev RODGERS  ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

📡 *CHANNEL INFO*

🛠️ *ID:* ${metadata.id}
📌 *Name:* ${metadata.name || 'Unknown'}
👥 *Followers:* ${metadata.subscribers?.toLocaleString() || 'N/A'}
📅 *Created:* ${metadata.creation_time ? new Date(metadata.creation_time * 1000).toLocaleString() : 'Unknown'}

${settings.footer}`;

            // 👇 REACT WITH SUCCESS
            await conn.sendMessage(chatId, {
                react: { text: '✅', key: mek.key }
            });

            // Try to send with image if available
            if (metadata.preview) {
                await conn.sendMessage(chatId, {
                    image: { url: `https://pps.whatsapp.net${metadata.preview}` },
                    caption: infoText
                });
            } else {
                await conn.sendMessage(chatId, {
                    text: infoText
                });
            }

        } catch (error) {
            console.error('Error in cid command:', error);
            await conn.sendMessage(chatId, {
                react: { text: '❌', key: mek.key }
            });
            await conn.sendMessage(chatId, {
                text: '⚠️ An unexpected error occurred.'
            });
        }
    }
};