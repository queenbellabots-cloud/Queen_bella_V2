/**
 * 👑 QUEEN BELLA MD - Notes
 * Save and retrieve notes (Owner only)
 */

const settings = require('../settings');
const fs = require('fs');
const path = require('path');

const NOTES_FILE = path.join(__dirname, '../data/notes.json');

// Load notes from file
function loadNotes() {
    try {
        if (fs.existsSync(NOTES_FILE)) {
            return JSON.parse(fs.readFileSync(NOTES_FILE, 'utf8'));
        }
    } catch (e) {}
    return {};
}

// Save notes to file
function saveNotes(notes) {
    try {
        const dir = path.dirname(NOTES_FILE);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(NOTES_FILE, JSON.stringify(notes, null, 2));
    } catch (e) {
        console.error('Error saving notes:', e);
    }
}

module.exports = {
    name: 'note',
    aliases: ['notes', 'save'],
    category: 'tools',
    description: 'Save or retrieve notes',
    usage: '.note <save|get|list|delete> <key> [value]',
    react: '📝',
    async execute(conn, mek, args, chatId, isOwner) {
        try {
            const sender = mek.key.participant || mek.key.remoteJid;
            const ownerNumber = settings.ownerNumber || '254755660053';
            const isBotOwner = sender === ownerNumber + '@s.whatsapp.net' || 
                              sender === ownerNumber + '@c.us' ||
                              senderNumber === ownerNumber;

            if (!isBotOwner && !isOwner) {
                await conn.sendMessage(chatId, {
                    react: { text: '⛔', key: mek.key }
                });
                await conn.sendMessage(chatId, { 
                    text: '⛔ This command is for the bot owner only!'
                });
                return;
            }

            const notes = loadNotes();

            if (!args.length) {
                await conn.sendMessage(chatId, {
                    react: { text: '❌', key: mek.key }
                });
                await conn.sendMessage(chatId, { 
                    text: `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   📝 NOTES COMMAND          ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

❌ *No action provided!*

📝 *Usage:*
.note save <key> <value>  → Save a note
.note get <key>           → Get a note
.note list                → List all notes
.note delete <key>        → Delete a note

📌 *Examples:*
.note save password mypass
.note get password
.note list
.note delete password

${settings.footer}`
                });
                return;
            }

            const action = args[0].toLowerCase();

            // LIST NOTES
            if (action === 'list') {
                const keys = Object.keys(notes);
                if (keys.length === 0) {
                    await conn.sendMessage(chatId, {
                        react: { text: '📭', key: mek.key }
                    });
                    await conn.sendMessage(chatId, { 
                        text: '📭 No notes saved yet.'
                    });
                    return;
                }

                const list = keys.map((key, i) => `${i+1}. ${key}`).join('\n');
                await conn.sendMessage(chatId, {
                    react: { text: '📋', key: mek.key }
                });
                await conn.sendMessage(chatId, {
                    text: `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   📋 SAVED NOTES            ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

📝 *Total Notes:* ${keys.length}

${list}

${settings.footer}`
                });
                return;
            }

            // DELETE NOTE
            if (action === 'delete') {
                if (args.length < 2) {
                    await conn.sendMessage(chatId, {
                        react: { text: '❌', key: mek.key }
                    });
                    await conn.sendMessage(chatId, { 
                        text: '❌ Please specify which note to delete.\n\nUsage: .note delete <key>'
                    });
                    return;
                }

                const key = args[1];
                if (!notes[key]) {
                    await conn.sendMessage(chatId, {
                        react: { text: '❌', key: mek.key }
                    });
                    await conn.sendMessage(chatId, { 
                        text: `❌ Note "${key}" not found!`
                    });
                    return;
                }

                delete notes[key];
                saveNotes(notes);
                await conn.sendMessage(chatId, {
                    react: { text: '✅', key: mek.key }
                });
                await conn.sendMessage(chatId, { 
                    text: `✅ Note "${key}" deleted!`
                });
                return;
            }

            // SAVE NOTE
            if (action === 'save' || action === 'set') {
                if (args.length < 3) {
                    await conn.sendMessage(chatId, {
                        react: { text: '❌', key: mek.key }
                    });
                    await conn.sendMessage(chatId, { 
                        text: '❌ Please provide a key and value.\n\nUsage: .note save <key> <value>'
                    });
                    return;
                }

                const key = args[1];
                const value = args.slice(2).join(' ');
                notes[key] = value;
                saveNotes(notes);
                await conn.sendMessage(chatId, {
                    react: { text: '✅', key: mek.key }
                });
                await conn.sendMessage(chatId, { 
                    text: `✅ Note "${key}" saved!\n\n📝 ${value}`
                });
                return;
            }

            // GET NOTE
            if (action === 'get') {
                if (args.length < 2) {
                    await conn.sendMessage(chatId, {
                        react: { text: '❌', key: mek.key }
                    });
                    await conn.sendMessage(chatId, { 
                        text: '❌ Please specify which note to retrieve.\n\nUsage: .note get <key>'
                    });
                    return;
                }

                const key = args[1];
                if (!notes[key]) {
                    await conn.sendMessage(chatId, {
                        react: { text: '❌', key: mek.key }
                    });
                    await conn.sendMessage(chatId, { 
                        text: `❌ Note "${key}" not found!`
                    });
                    return;
                }

                await conn.sendMessage(chatId, {
                    react: { text: '📝', key: mek.key }
                });
                await conn.sendMessage(chatId, {
                    text: `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   📝 NOTE: ${key}           ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

${notes[key]}

${settings.footer}`
                });
                return;
            }

            // Invalid action
            await conn.sendMessage(chatId, {
                react: { text: '❌', key: mek.key }
            });
            await conn.sendMessage(chatId, { 
                text: `❌ Invalid action: ${action}\n\nAvailable: save, get, list, delete`
            });

        } catch (error) {
            console.error('Error in note:', error);
            await conn.sendMessage(chatId, { 
                text: '❌ Error with notes.'
            });
        }
    }
};