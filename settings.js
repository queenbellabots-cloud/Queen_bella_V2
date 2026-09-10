/**
 *    QUEEN BELLA MD V1 - Settings
 * ✏️ EDIT THE SECTIONS BELOW TO CUSTOMIZE YOUR BOT
 * ==================================================
 */

const settings = {

  // ═══════════════════════════════════════════════
  // 🤖 BOT IDENTITY
  // ═══════════════════════════════════════════════
  botName: "𝗤𝗨𝗘𝗘𝗡 𝗕𝗘𝗟𝗟𝗔 𝗩𝟭",
  botOwner: "rodgers",  // ← CHANGE TO YOUR NAME
  prefix: ".",

  // ═══════════════════════════════════════════════
  // 📱 YOUR NUMBER
  // ═══════════════════════════════════════════════
  ownerNumber: "254755660053",  // ← CHANGE TO YOUR NUMBER

  // ═══════════════════════════════════════════════
  // 🔒 BOT MODE (Default)
  // ═══════════════════════════════════════════════
  mode: "public",

  // ═══════════════════════════════════════════════
  // 👤 DEVELOPER 
  // ═══════════════════════════════════════════════
  developerNumber: "254755660053",  // RODGERS - Dev
  developerName: "RODGERS",

  // ═══════════════════════════════════════════════
  // 👤 SUDO USERS (Extra admins - Optional)
  // ═══════════════════════════════════════════════
  sudoUsers: [
    "254755660053",  // Developer (RODGERS)
  ],

  // ═══════════════════════════════════════════════
  // 📢 OUR CHANNEL
  // ═══════════════════════════════════════════════
  channelId: "120363411498601038@newsletter",
  channelLink: "https://whatsapp.com/channel/0029VbCwZHACXC3PNHgtMT31",
  channelName: "QUEEN BELLA MD",

  // ═══════════════════════════════════════════════
  // 🖼️ MENU IMAGE
  // ═══════════════════════════════════════════════
  menuImage: "https://i.imgur.com/687ZxLW.jpeg",

  // ═══════════════════════════════════════════════
  // 🖼️ IMAGES 
  // ═══════════════════════════════════════════════
  welcomeImages: [
    "https://i.imgur.com/687ZxLW.jpeg",
    "https://i.imgur.com/687ZxLW.jpeg",
    "https://i.imgur.com/687ZxLW.jpeg"
  ],

  // ═══════════════════════════════════════════════
  // ⚙️ ADVANCED - DO NOT CHANGE BELOW
  // ═══════════════════════════════════════════════
  footer: "© A BELLA BOTS PRODUCTIONS",
  usePairingCode: true,
  autoRead: true,
  timeZone: "Africa/Nairobi"

};

global.prefix = settings.prefix;
module.exports = settings;