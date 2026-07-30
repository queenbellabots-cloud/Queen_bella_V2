/**
 * QUEEN BELLA MD - Utility Functions
 */

const axios = require('axios');
const fs = require('fs');

// Convert message to serialized format
function smsg(conn, m, store) {
    if (!m) return m;
    return m;
}

// Check if URL is valid
function isUrl(url) {
    const pattern = new RegExp('^https?:\\/\\/', 'i');
    return pattern.test(url);
}

// Generate message tag
function generateMessageTag() {
    return Date.now().toString() + Math.random().toString(36).substr(2, 5);
}

// Get buffer from URL or file
async function getBuffer(url, options = {}) {
    try {
        const response = await axios({
            method: 'get',
            url: url,
            responseType: 'arraybuffer',
            ...options
        });
        return Buffer.from(response.data);
    } catch (error) {
        console.error('Error getting buffer:', error.message);
        return null;
    }
}

// Get size of media
async function getSizeMedia(url) {
    try {
        const response = await axios.head(url);
        return parseInt(response.headers['content-length'] || 0);
    } catch (error) {
        console.error('Error getting size:', error.message);
        return 0;
    }
}

// Fetch data from URL
async function fetch(url, options = {}) {
    try {
        const response = await axios.get(url, options);
        return response.data;
    } catch (error) {
        console.error('Error fetching:', error.message);
        return null;
    }
}

// Sleep function
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Resize image
function reSize(buffer, width, height) {
    // Simple resize placeholder
    return buffer;
}

// Generate random string
function generateRandomString(length = 10) {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}

// Format file size
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + ' ' + sizes[i];
}

// Check if file exists
function fileExists(filePath) {
    try {
        return fs.existsSync(filePath);
    } catch (error) {
        return false;
    }
}

// Read JSON file
function readJSON(filePath) {
    try {
        if (fs.existsSync(filePath)) {
            const data = fs.readFileSync(filePath, 'utf8');
            return JSON.parse(data);
        }
        return null;
    } catch (error) {
        console.error('Error reading JSON:', error.message);
        return null;
    }
}

// Write JSON file
function writeJSON(filePath, data) {
    try {
        const dir = filePath.substring(0, filePath.lastIndexOf('/'));
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error('Error writing JSON:', error.message);
        return false;
    }
}

// Download media from WhatsApp
async function downloadMedia(msg, type = 'buffer') {
    try {
        const stream = await downloadContentFromMessage(
            msg.message[Object.keys(msg.message)[0]], 
            msg.type || 'document'
        );
        let buffer = Buffer.from([]);
        for await (const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk]);
        }
        return buffer;
    } catch (error) {
        console.error('Error downloading media:', error.message);
        return null;
    }
}

module.exports = {
    smsg,
    isUrl,
    generateMessageTag,
    getBuffer,
    getSizeMedia,
    fetch,
    sleep,
    reSize,
    generateRandomString,
    formatFileSize,
    fileExists,
    readJSON,
    writeJSON,
    downloadMedia
};