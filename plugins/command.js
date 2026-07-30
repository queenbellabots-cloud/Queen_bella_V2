/**
 * Base command class for QUEEN BELLA MD
 */

class Command {
    constructor(options = {}) {
        this.name = options.name || 'unknown';
        this.aliases = options.aliases || [];
        this.category = options.category || 'general';
        this.description = options.description || 'No description';
        this.usage = options.usage || '';
        this.isOwner = options.isOwner || false;
        this.isGroup = options.isGroup || false;
        this.isPrivate = options.isPrivate || false;
        this.execute = options.execute || (() => {});
    }
}

module.exports = Command;