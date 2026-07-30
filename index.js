if (connection === "open") {
    console.clear();
    console.log(chalk.magenta.bold(`
    ╔══════════════════════════════════╗
    ║      👑 QUEEN BELLA MD V1      ║
    ║    Created by Dev RODGERS       ║
    ╚══════════════════════════════════╝
    `));
    console.log(chalk.magenta.bold(`    [ QUEEN BELLA MD is Online! ]\n`));
    console.log(chalk.cyan(`< ================================== >`));
    console.log(chalk.magenta(`👑 BOT NAME  : ${settings.botName}`));
    console.log(chalk.magenta(`👑 OWNER     : ${settings.botOwner}`));
    console.log(chalk.magenta(`👨‍💻 DEVELOPER : Dev RODGERS`));
    console.log(chalk.green(`👑 STATUS    : Connected! ✅`));
    console.log(chalk.cyan(`< ================================== >\n`));
    
    // 👇 ADD THIS WELCOME MESSAGE
    try {
        const botNumber = QueenBella.user.id.split(':')[0] + '@s.whatsapp.net';
        const currentPrefix = settings.prefix || '.';
        
        // Pick random welcome image
        const welcomeImages = settings.welcomeImages || [
            "https://imagetourl.cloud/jey865he.jpg",
            "https://imagetourl.cloud/8uafyai1.jpg"
        ];
        const randomImage = welcomeImages[Math.floor(Math.random() * welcomeImages.length)];
        
        const welcomeText = `╔═══════════════════════════════════════╗
║     👑 QUEEN BELLA MD V1 👑          ║
║    Created by Dev RODGERS             ║
╚═══════════════════════════════════════╝

╔═══════════════════════════════════════╗
║       ✅ CONNECTED SUCCESSFULLY       ║
╚═══════════════════════════════════════╝

👑 *Bot:* ${settings.botName}
👤 *Owner:* ${settings.botOwner}
👨‍💻 *Developer:* Dev RODGERS
📱 *Number:* ${settings.ownerNumber}
⚡ *Prefix:* ${currentPrefix}
🟢 *Status:* Online and Ready!

╔═══════════════════════════════════════╗
║  📢 JOIN OUR CHANNEL                 ║
║  👇 Click the button below            ║
╚═══════════════════════════════════════╝

${settings.footer}`;

        await QueenBella.sendMessage(botNumber, {
            image: { url: randomImage },
            caption: welcomeText,
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: settings.channelId,
                    newsletterName: settings.channelName,
                    serverMessageId: 1
                },
                externalAdReply: {
                    title: settings.botName,
                    body: "Connected Successfully! ✅",
                    mediaType: 1,
                    renderLargerThumbnail: true,
                    thumbnailUrl: randomImage,
                    sourceUrl: settings.channelLink,
                    mediaUrl: settings.channelLink
                }
            }
        });
        console.log(chalk.green('✅ Welcome message sent!'));
    } catch (error) {
        console.error('Error sending welcome message:', error.message);
    }
}