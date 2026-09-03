require('dotenv').config();

// =============================================
//  QUEEN BELLA MD - API CONFIGURATION
//  Created by Dev RODGERS
// =============================================

global.APIs = {
    xteam: 'https://api.xteam.xyz',
    dzx: 'https://api.dhamzxploit.my.id',
    lol: 'https://api.lolhuman.xyz',
    violetics: 'https://violetics.pw',
    neoxr: 'https://api.neoxr.my.id',
    zenzapis: 'https://zenzapis.xyz',
    akuari: 'https://api.akuari.my.id',
    akuari2: 'https://apimu.my.id',
    nrtm: 'https://fg-nrtm.ddns.net',
    bg: 'http://bochil.ddns.net',
    fgmods: 'https://api-fgmods.ddns.net'
};

global.APIKeys = {
    'https://api.xteam.xyz': 'd90a9e986e18778b',
    'https://api.lolhuman.xyz': '85faf717d0545d14074659ad',
    'https://api.neoxr.my.id': 'yourkey',
    'https://violetics.pw': 'beta',
    'https://zenzapis.xyz': 'yourkey',
    'https://api-fgmods.ddns.net': 'fg-dylux'
};

// QUEEN BELLA MD Settings
global.prefix = process.env.PREFIX || '.';
global.botName = "𝐐𝐔𝐄𝐄𝐍 𝐁𝐄𝐋𝐋𝐀 𝐌𝐃";
global.ownerName = "𝐑𝐎𝐃𝐆𝐄𝐑𝐒 𝐎𝐍𝐘𝐀𝐍𝐆𝐎";
global.ownerNumber = process.env.OWNER_NUMBER || "254755660053";
global.developer = "𝐑𝐎𝐃𝐆𝐄𝐑𝐒 𝐎𝐍𝐘𝐀𝐍𝐆𝐎";
global.botVersion = "1.0.0";
global.botFooter = "> © MADE BY RODGERS";
global.botImage = "https://i.imgur.com/687ZxLW.jpeg";

module.exports = {
    WARN_COUNT: 3,
    APIs: global.APIs,
    APIKeys: global.APIKeys
};