const fs = require('fs');
if (fs.existsSync('config.env')) require('dotenv').config({ path: './config.env' });

const config = process.env;

function convertToBool(text, fault = 'true') {
    return text === fault ? true : false;
}

module.exports = {
  // Auto Features
  AUTO_VIEW_STATUS: 'true',
  AUTO_LIKE_STATUS: 'true',
  AUTO_STATUS_SEEN: 'true',
  AUTO_STATUS_REACT: 'true',
  AUTO_STATUS_REPLY: 'false',
  AUTO_RECORDING: 'false',
  AUTO_REACT: 'false',
  READ_MESSAGE: 'false',

  // Status Reply Message
  AUTO_STATUS_MSG: "Has been seen by Queen bella Md",

  // Auto Like Emojis
  AUTO_LIKE_EMOJI: ['🖤', '🍬', '💫', '🎈', '💚', '🎶', '❤️', '🧫', '⚽'],

  // Bot Settings
  PREFIX: config.PREFIX || '.',
  MODE: config.MODE || "public",
  WORK_TYPE: "public",

  // Bot Identity
  BOT_FOOTER: '> © MADE BY RODGERS',
  IMAGE_PATH: 'https://i.imgur.com/687ZxLW.jpeg',

  // Owner
  OWNER_NUMBER: '254755660053',

  // Links
  GROUP_INVITE_LINK: 'https://chat.whatsapp.com/L4TfGq6jXsR3pLbRkStcj8',
  CHANNEL_LINK: 'https://whatsapp.com/channel/0029VbBR3ib3LdQQlEG3vd1x',

  // Newsletter
  NEWSLETTER_JID: '120363423209691396@newsletter',
  NEWSLETTER_MESSAGE_ID: '428',

  // Security
  ANTI_CALL: 'false',

  // System
  MAX_RETRIES: 3,
  OTP_EXPIRY: 300000,
  DEV_MODE: 'false',

  // Custom Reactions
  CUSTOM_REACT: 'false',
  CUSTOM_REACT_EMOJIS: '🥲,😂,👍🏻,🙂,😔',

  // Admin
  ADMIN_LIST_PATH: './admin.json',
};