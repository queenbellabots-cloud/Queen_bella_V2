/**
 * 👑 QUEEN BELLA MD - Set Profile Picture (Image or Video)
 * Sets image or video as WhatsApp profile picture
 * Videos are auto-cut to 6 seconds and loop forever
 * AUTO-INSTALLS ffmpeg if not found
 * ✅ EVERYONE CAN USE
 */

const settings = require('../settings');
const { downloadContentFromMessage } = require('@whiskeysockets/baileys');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

// Check if ffmpeg is installed
function checkFfmpeg() {
    try {
        require.resolve('fluent-ffmpeg');
        return true;
    } catch (e) {
        return false;
    }
}

module.exports = {
    name: 'setdp',
    aliases: ['setpp', 'changepp', 'profile', 'setvideodp'],
    category: 'tools',
    description: 'Change WhatsApp profile picture (image or video)',
    usage: '.setdp (reply to image/video)',
    react: '📸',
    async execute(conn, mek, args, chatId, isOwner) {
        try {
            await conn.sendMessage(chatId, {
                react: { text: '📸', key: mek.key }
            });

            // ✅ REMOVED OWNER CHECK - EVERYONE CAN USE!

            const quoted = mek.message?.extendedTextMessage?.contextInfo?.quotedMessage;
            if (!quoted) {
                await conn.sendMessage(chatId, {
                    text: `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   👑 QUEEN BELLA MD V1   ┃
┃   Created by Dev RODGERS  ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

📸 *SET PROFILE PICTURE*

❌ Please reply to an image or video.

📋 *Usage:*
• Reply to an image with .setdp
• Reply to a video with .setdp

🎥 *Video Features:*
• Auto-cut to 6 seconds
• Auto-loop (plays forever)

${settings.footer}`
                });
                return;
            }

            const isImage = !!quoted.imageMessage;
            const isVideo = !!quoted.videoMessage;

            if (!isImage && !isVideo) {
                await conn.sendMessage(chatId, {
                    text: '❌ Please reply to an image or video.'
                });
                return;
            }

            // If video, check and install ffmpeg if needed
            if (isVideo && !checkFfmpeg()) {
                await conn.sendMessage(chatId, {
                    text: '📦 *Installing ffmpeg...*\n\n⏳ This may take a moment...'
                });

                await new Promise((resolve) => {
                    const install = exec('npm install fluent-ffmpeg --save', {
                        cwd: path.join(__dirname, '..')
                    });
                    install.on('close', (code) => {
                        resolve(code === 0);
                    });
                });

                if (!checkFfmpeg()) {
                    await conn.sendMessage(chatId, {
                        text: '❌ *Failed to install ffmpeg.*\n\nPlease run manually: npm install fluent-ffmpeg'
                    });
                    return;
                }

                await conn.sendMessage(chatId, {
                    text: '✅ *ffmpeg installed successfully!*\n\n🔄 Converting video...'
                });
            }

            await conn.sendMessage(chatId, {
                text: `📸 ${isImage ? 'Setting profile picture...' : '🎥 Converting video to animated DP...'}\n\n⏳ Please wait...`
            });

            // Download the media
            const stream = await downloadContentFromMessage(
                isImage ? quoted.imageMessage : quoted.videoMessage,
                isImage ? 'image' : 'video'
            );

            let buffer = Buffer.from([]);
            for await (const chunk of stream) {
                buffer = Buffer.concat([buffer, chunk]);
            }

            let finalBuffer = buffer;

            // If video, convert to animated WebP with auto-loop
            if (isVideo) {
                const ffmpeg = require('fluent-ffmpeg');
                const tempDir = os.tmpdir();
                const inputPath = path.join(tempDir, `video_${Date.now()}.mp4`);
                const outputPath = path.join(tempDir, `animated_${Date.now()}.webp`);

                fs.writeFileSync(inputPath, buffer);

                await new Promise((resolve, reject) => {
                    ffmpeg(inputPath)
                        .inputOptions(['-t 6'])
                        .outputOptions([
                            '-vf', 'fps=15,scale=512:512:force_original_aspect_ratio=decrease,pad=512:512:(ow-iw)/2:(oh-ih)/2',
                            '-c:v', 'libwebp',
                            '-lossless', '0',
                            '-q:v', '80',
                            '-loop', '0',
                            '-an'
                        ])
                        .save(outputPath)
                        .on('end', () => {
                            try {
                                finalBuffer = fs.readFileSync(outputPath);
                                fs.unlinkSync(inputPath);
                                fs.unlinkSync(outputPath);
                                resolve();
                            } catch (e) {
                                reject(e);
                            }
                        })
                        .on('error', (err) => {
                            try { fs.unlinkSync(inputPath); } catch (e) {}
                            reject(err);
                        });
                });
            }

            // Update the profile picture
            await conn.updateProfilePicture(conn.user.id, finalBuffer);

            await conn.sendMessage(chatId, {
                react: { text: '✅', key: mek.key }
            });

            await conn.sendMessage(chatId, {
                text: `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   👑 QUEEN BELLA MD V1   ┃
┃   Created by Dev RODGERS  ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

${isImage ? '📸' : '🎥'} *PROFILE PICTURE UPDATED!*

${isImage ? '📸 Profile picture has been updated with the image.' : '🎥 Animated profile picture has been set from the video.'}

${isVideo ? `📌 *Features:*\n• Auto-cut to 6 seconds\n• 🔄 Auto-loop (plays forever)\n• Converted to animated DP` : ''}

🕒 *Time:* ${new Date().toLocaleString()}

┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃  📢 JOIN OUR CHANNEL         ┃
┃  👇 Click the button below    ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

${settings.footer}`
            });

        } catch (error) {
            console.error('Error in setdp:', error);
            await conn.sendMessage(chatId, {
                react: { text: '❌', key: mek.key }
            });
            await conn.sendMessage(chatId, {
                text: `❌ Error: ${error.message}`
            });
        }
    }
};