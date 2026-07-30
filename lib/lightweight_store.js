/**
 * QUEEN BELLA MD - Lightweight Store
 * Handles message and contact storage
 */

const fs = require('fs');
const path = require('path');

class LightweightStore {
    constructor() {
        this.contacts = {};
        this.messages = {};
        this.filePath = './data/store.json';
    }

    // Read data from file
    readFromFile() {
        try {
            if (fs.existsSync(this.filePath)) {
                const data = fs.readFileSync(this.filePath, 'utf8');
                const parsed = JSON.parse(data);
                this.contacts = parsed.contacts || {};
                this.messages = parsed.messages || {};
                console.log('📂 Store loaded successfully');
            }
        } catch (error) {
            console.error('Error reading store file:', error.message);
        }
    }

    // Write data to file
    writeToFile() {
        try {
            const dir = this.filePath.substring(0, this.filePath.lastIndexOf('/'));
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            fs.writeFileSync(this.filePath, JSON.stringify({
                contacts: this.contacts,
                messages: this.messages
            }, null, 2));
        } catch (error) {
            console.error('Error writing store file:', error.message);
        }
    }

    // Bind to Baileys events
    bind(ev) {
        // Store contacts
        ev.on('contacts.update', (updates) => {
            for (let update of updates) {
                if (update.id && update.notify) {
                    this.contacts[update.id] = {
                        id: update.id,
                        name: update.notify,
                        verifiedName: update.verifiedName || ''
                    };
                }
            }
        });

        // Store messages
        ev.on('messages.upsert', (update) => {
            try {
                const mek = update.messages[0];
                if (mek && mek.key) {
                    const jid = mek.key.remoteJid;
                    const id = mek.key.id;
                    if (jid && id) {
                        if (!this.messages[jid]) {
                            this.messages[jid] = {};
                        }
                        this.messages[jid][id] = mek;
                        
                        // Limit store size (keep last 100 messages per chat)
                        const keys = Object.keys(this.messages[jid]);
                        if (keys.length > 100) {
                            const toDelete = keys.slice(0, keys.length - 100);
                            for (const key of toDelete) {
                                delete this.messages[jid][key];
                            }
                        }
                    }
                }
            } catch (error) {
                console.error('Error storing message:', error.message);
            }
        });
    }

    // Load message by jid and id
    async loadMessage(jid, id) {
        try {
            if (this.messages[jid] && this.messages[jid][id]) {
                return this.messages[jid][id];
            }
            return null;
        } catch (error) {
            console.error('Error loading message:', error.message);
            return null;
        }
    }

    // Save message
    saveMessage(jid, id, message) {
        try {
            if (!this.messages[jid]) {
                this.messages[jid] = {};
            }
            this.messages[jid][id] = message;
        } catch (error) {
            console.error('Error saving message:', error.message);
        }
    }
}

module.exports = new LightweightStore();