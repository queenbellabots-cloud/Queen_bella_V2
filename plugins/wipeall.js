/**
 * 👑 QUEEN BELLA MD - Wipe All Messages / Chat
 * Deletes ALL bot messages in a chat, or nukes entire chat
 */

const settings = require('../settings');
const fs = require('fs');

module.exports = {
    name: 'wipeall',
    aliases: ['nuke', 'clearall', 'ghostwipe', 'nukechat'],
    category: 'owner',
    description: 'Wipe all bot messages or nuke entire chat',
    usage: '.wipeall [messages|chat]',
    react: '💣',
    async execute(conn, mek, args, chatId, isOwner) {
        try {
            const sender = mek.key.participant || mek.key.remoteJid;
            const senderNumber = sender.split('@')[0];
            const ownerNumber = settings.ownerNumber || '254755660053';

            // Owner only
            if (senderNumber !== ownerNumber && !isOwner) {
                await conn.sendMessage(chatId, {
                    react: { text: '⛔', key: mek.key }
                });
                await conn.sendMessage(chatId, {
                    text: '⛔ *Owner only command!*'
                });
                return;
            }

            const action = args[0]?.toLowerCase();

            // ── HELP ──
            if (!action) {
                await conn.sendMessage(chatId, {
                    text: `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   💣 WIPE ALL                ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

📝 *Choose what to wipe:*

💬 *.wipeall messages*
   → Deletes ALL bot messages in this chat
   → No "deleted" notification spam

🔥 *.wipeall chat*
   → Deletes ALL bot messages
   → AND clears the entire chat
   → Both you and the other person lose history

⚠️ *Warning:* This is destructive!

${settings.footer}`
                });
                return;
            }

            const isGroup = chatId.endsWith('@g.us');

            // ═══════════════════════════════════════════
            // 🔥 WIPE ALL MESSAGES
            // ═══════════════════════════════════════════
            if (action === 'messages' || action === 'msg') {
                await conn.sendMessage(chatId, {
                    react: { text: '💣', key: mek.key }
                });

                await conn.sendMessage(chatId, {
                    text: `💣 *Wiping all bot messages...*\n\n⏳ This may take a moment...`
                });

                try {
                    // Load last 100 messages
                    const messages = await conn.loadMessages(chatId, 100);
                    let deleted = 0;

                    for (const msg of messages) {
                        if (msg.key.fromMe) {
                            try {
                                await conn.sendMessage(chatId, {
                                    delete: {
                                        remoteJid: chatId,
                                        fromMe: true,
                                        id: msg.key.id,
                                        participant: msg.key.participant
                                    }
                                });
                                deleted++;
                                await new Promise(r => setTimeout(r, 250));
                            } catch (e) {}
                        }
                    }

                    console.log(`💣 Wiped ${deleted} bot messages in ${chatId}`);

                    // Send result after
                    await conn.sendMessage(chatId, {
                        text: `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   ✅ WIPE COMPLETE           ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

💬 *Messages wiped:* ${deleted}
📱 *Chat:* ${isGroup ? 'Group' : 'DM'}
🕐 *Time:* ${new Date().toLocaleString()}

💡 *Use .wipeall chat to also clear the chat itself*

${settings.footer}`
                    });

                } catch (e) {
                    console.error('Wipe messages error:', e);
                    await conn.sendMessage(chatId, {
                        text: `❌ Error: ${e.message}`
                    });
                }
                return;
            }

            // ═══════════════════════════════════════════
            // 🔥 NUKE ENTIRE CHAT
            // ═══════════════════════════════════════════
            if (action === 'chat' || action === 'nuke' || action === 'all') {
                await conn.sendMessage(chatId, {
                    react: { text: '🔥', key: mek.key }
                });

                await conn.sendMessage(chatId, {
                    text: `🔥 *NUKE SEQUENCE INITIATED*\n\n⏳ Wiping messages + clearing chat...`
                });

                try {
                    // Step 1: Load and delete all bot messages
                    const messages = await conn.loadMessages(chatId, 200);
                    let deleted = 0;

                    for (const msg of messages) {
                        if (msg.key.fromMe) {
                            try {
                                await conn.sendMessage(chatId, {
                                    delete: {
                                        remoteJid: chatId,
                                        fromMe: true,
                                        id: msg.key.id,
                                        participant: msg.key.participant
                                    }
                                });
                                deleted++;
                                await new Promise(r => setTimeout(r, 200));
                            } catch (e) {}
                        }
                    }

                    // Step 2: Try to clear the chat
                    try {
                        await conn.chatModify(
                            {
                                delete: true,
                                lastMessages: [
                                    {
                                        key: messages[0]?.key || mek.key,
                                        messageTimestamp: Math.floor(Date.now() / 1000)
                                    }
                                ]
                            },
                            chatId
                        );
                        console.log(`🔥 Chat cleared: ${chatId}`);
                    } catch (chatErr) {
                        console.log('Chat clear failed (normal):', chatErr.message);
                    }

                    // Step 3: Also clear local store
                    try {
                        const store = require('../lib/lightweight_store');
                        if (store.messages && store.messages[chatId]) {
                            delete store.messages[chatId];
                            store.writeToFile();
                        }
                    } catch (e) {}

                    console.log(`🔥 Nuked chat ${chatId} — ${deleted} messages wiped`);

                    // Step 4: Final notification (self-destruct)
                    const finalMsg = await conn.sendMessage(chatId, {
                        text: `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   🔥 NUKE COMPLETE           ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

💣 *Messages wiped:* ${deleted}
💬 *Chat cleared:* Yes
📱 *Chat type:* ${isGroup ? 'Group' : 'DM'}
🕐 *Time:* ${new Date().toLocaleString()}

⚠️ *This chat will self-destruct in 5 seconds...*

${settings.footer}`
                    });

                    // Step 5: Auto-delete the final notification too
                    setTimeout(async () => {
                        try {
                            await conn.sendMessage(chatId, {
                                delete: {
                                    remoteJid: chatId,
                                    fromMe: true,
                                    id: finalMsg.key.id
                                }
                            });
                            console.log('🔥 Final notification self-destructed');
                        } catch (e) {}
                    }, 5000);

                } catch (e) {
                    console.error('Nuke error:', e);
                    await conn.sendMessage(chatId, {
                        text: `❌ Error: ${e.message}`
                    });
                }
                return;
            }

            // Invalid action
            await conn.sendMessage(chatId, {
                text: `❌ Invalid action: ${action}\n\nUse:\n.wipeall messages\n.wipeall chat`
            });

        } catch (error) {
            console.error('WipeAll error:', error);
        }
    }
};