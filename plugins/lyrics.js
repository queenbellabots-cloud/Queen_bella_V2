/**
 * 👑 QUEEN BELLA MD - Lyrics Command
 * Get song lyrics using lyrics.ovh API (FREE, NO API KEY)
 */

const settings = require('../settings');
const axios = require('axios');

const REACTIONS = ['🎵', '🎶', '🎤', '📝', '✨', '🎼'];

// Fetch lyrics from lyrics.ovh API (free, no key needed!)
async function getLyrics(artist, song) {
    try {
        const url = `https://api.lyrics.ovh/v1/${encodeURIComponent(artist)}/${encodeURIComponent(song)}`;
        const response = await axios.get(url);
        
        if (response.data && response.data.lyrics) {
            return response.data.lyrics;
        }
        return null;
    } catch (error) {
        if (error.response && error.response.status === 404) {
            return null; // Song not found
        }
        throw error;
    }
}

// Format lyrics with clean formatting
function formatLyrics(artist, song, lyrics) {
    // Remove extra newlines and clean up
    const cleanLyrics = lyrics
        .replace(/\r/g, '')
        .split('\n')
        .filter(line => line.trim() !== '')
        .join('\n');
    
    // Truncate if too long (WhatsApp limit)
    const maxLength = 4000;
    let displayLyrics = cleanLyrics;
    if (displayLyrics.length > maxLength) {
        displayLyrics = displayLyrics.substring(0, maxLength) + '\n\n... (lyrics truncated)';
    }
    
    return `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   🎵 SONG LYRICS              ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

📌 *Song:* ${song}
🎤 *Artist:* ${artist}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${displayLyrics}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${settings.footer}`;
}

module.exports = {
    name: 'lyrics',
    aliases: ['lyric', 'song', 'l'],
    category: 'fun',
    description: 'Get song lyrics',
    usage: '.lyrics <song name> or .lyrics <artist> - <song>',
    react: '🎵',
    async execute(conn, mek, args, chatId, isOwner) {
        try {
            const sender = mek.key.participant || mek.key.remoteJid;
            
            if (!args.length) {
                await conn.sendMessage(chatId, {
                    react: { text: '❌', key: mek.key }
                });
                await conn.sendMessage(chatId, { 
                    text: `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   🎵 LYRICS COMMAND          ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

❌ *No song provided!*

📝 *Usage:*
.lyrics <song name>
.lyrics <artist> - <song name>

📌 *Examples:*
.lyrics Bohemian Rhapsody
.lyrics Queen - Bohemian Rhapsody

${settings.footer}`
                });
                return;
            }

            const randomReact = REACTIONS[Math.floor(Math.random() * REACTIONS.length)];
            await conn.sendMessage(chatId, {
                react: { text: randomReact, key: mek.key }
            });

            // Parse input: "artist - song" or just "song"
            let artist = '';
            let song = '';
            const input = args.join(' ');
            
            if (input.includes(' - ')) {
                const parts = input.split(' - ');
                artist = parts[0].trim();
                song = parts[1].trim();
            } else {
                song = input.trim();
                // Try to auto-detect artist from common patterns
                // User can just provide song name
            }

            // Send searching message
            const searchMsg = await conn.sendMessage(chatId, { 
                text: `🔍 *Searching for lyrics...*\n\n${song}${artist ? ` by ${artist}` : ''}`
            });

            // Try to get lyrics
            let lyrics = null;
            let usedArtist = artist;
            let usedSong = song;

            try {
                if (artist) {
                    // User specified artist and song
                    lyrics = await getLyrics(artist, song);
                    usedArtist = artist;
                    usedSong = song;
                } else {
                    // Try common artist-song pairs for popular songs
                    // Try without artist first (some songs work)
                    // Then try with a "lyrics" search approach
                    
                    // Try the song as-is
                    try {
                        // Try with a generic "artist" approach - use the first word as potential artist
                        const words = song.split(' ');
                        if (words.length > 1) {
                            // Try using first word as artist (common for some APIs)
                            // But for lyrics.ovh we need exact match
                            // So we'll try a few common artist names
                            const commonArtists = ['The', 'A', 'An'];
                            if (commonArtists.includes(words[0])) {
                                // Try with "The" prefix
                                const altArtist = words.slice(0, 2).join(' ');
                                const altSong = words.slice(2).join(' ');
                                if (altSong) {
                                    lyrics = await getLyrics(altArtist, altSong);
                                    if (lyrics) {
                                        usedArtist = altArtist;
                                        usedSong = altSong;
                                    }
                                }
                            }
                        }
                    } catch (e) {}
                    
                    // If still no lyrics, inform user
                    if (!lyrics) {
                        await conn.sendMessage(chatId, {
                            react: { text: '❌', key: mek.key }
                        });
                        await conn.sendMessage(chatId, {
                            text: `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   ❌ LYRICS NOT FOUND        ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

❌ *Could not find lyrics for:* "${song}"

💡 *Tips:*
• Include the artist name: *.lyrics Queen - Bohemian Rhapsody*
• Check your spelling
• Try a different song

${settings.footer}`
                        });
                        return;
                    }
                }
            } catch (error) {
                console.error('Lyrics fetch error:', error.message);
            }

            // If we got lyrics from the artist+title search
            if (!lyrics && artist) {
                // Try without artist
                try {
                    lyrics = await getLyrics('', song);
                    if (lyrics) {
                        usedArtist = 'Unknown Artist';
                        usedSong = song;
                    }
                } catch (e) {}
            }

            if (!lyrics) {
                await conn.sendMessage(chatId, {
                    react: { text: '❌', key: mek.key }
                });
                await conn.sendMessage(chatId, {
                    text: `┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
┃   ❌ LYRICS NOT FOUND        ┃
┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

❌ *Could not find lyrics for:* "${song}"

💡 *Tips:*
• Use the format: *.lyrics Artist - Song Name*
• Check your spelling
• Try a different song

${settings.footer}`
                });
                return;
            }

            // Format and send lyrics
            const formattedLyrics = formatLyrics(usedArtist, usedSong, lyrics);
            
            await conn.sendMessage(chatId, {
                react: { text: '✅', key: mek.key }
            });
            
            await conn.sendMessage(chatId, {
                text: formattedLyrics,
                contextInfo: {
                    mentionedJid: [sender],
                    forwardingScore: 999,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: settings.channelId,
                        newsletterName: settings.channelName,
                        serverMessageId: 1
                    }
                }
            });

        } catch (error) {
            console.error('Error in lyrics command:', error);
            await conn.sendMessage(chatId, { 
                text: '❌ Error fetching lyrics. Please try again.'
            });
        }
    }
};