/**
 * 👑 QUEEN BELLA MD - View Once Shortcut
 * Same as .vv but shorter
 */

module.exports = {
    name: 'vo',
    aliases: ['reveal'],
    category: 'tools',
    description: 'Reveal view-once media (.vv does the same)',
    usage: '.vo (reply to view-once media)',
    react: '👁️',
    async execute(conn, mek, args, chatId, isOwner) {
        // Just call the vv command
        const vvCommand = require('./vv');
        await vvCommand.execute(conn, mek, args, chatId, isOwner);
    }
};