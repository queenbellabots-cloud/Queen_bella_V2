const fs = require('fs');
if (fs.existsSync('config.env')) require('dotenv').config({ path: './config.env' });

// Ajout nécessaire !
const config = process.env;

function convertToBool(text, fault = 'true') {
    return text === fault ? true : false;
}

module.exports = {
  AUTO_VIEW_STATUS: 'true',
  AUTO_LIKE_STATUS: 'true',
  AUTO_RECORDING: 'false',
  ANTI_CALL: 'false',
    
  AUTO_LIKE_EMOJI: ['🖤', '🍬', '💫', '🎈', '💚', '🎶', '❤️', '🧫', '⚽'],

  PREFIX: config.PREFIX || '.',

  BOT_FOOTER: '> © MADE BY RODGERS',

  MAX_RETRIES: 3,

  GROUP_INVITE_LINK: 'https://chat.whatsapp.com/L4TfGq6jXsR3pLbRkStcj8',

  ADMIN_LIST_PATH: './admin.json',
  IMAGE_PATH: 'https://i.imgur.com/687ZxLW.jpeg',

  NEWSLETTER_JID: '120363423209691396@newsletter',
  NEWSLETTER_MESSAGE_ID: '428',

  OTP_EXPIRY: 300000,

  OWNER_NUMBER: '254755660053',

  DEV_MODE: 'false',

  CHANNEL_LINK: 'https://whatsapp.com/channel/0029VbBR3ib3LdQQlEG3vd1x',

  WORK_TYPE: "public",

  ANTI_CAL: "off",

  AUTO_REACT: config.AUTO_REACT || 'false',
  ANTI_CALL: config.ANTI_CALL || 'false',
  AUTO_STATUS_SEEN: config.AUTO_STATUS_SEEN || "true",
  AUTO_STATUS_REACT: config.AUTO_STATUS_REACT || "true",
  AUTO_STATUS_REPLY: config.AUTO_STATUS_REPLY || "false",
  AUTO_STATUS_MSG: config.AUTO_STATUS_MSG || "Has been seen by Queen bella Md",

  READ_MESSAGE: config.READ_MESSAGE || 'false',

  CUSTOM_REACT: config.CUSTOM_REACT || 'false',
  CUSTOM_REACT_EMOJIS: config.CUSTOM_REACT_EMOJIS || '🥲,😂,👍🏻,🙂,😔',

  MODE: config.MODE || "public",
};
