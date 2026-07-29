const express = require('express');
const app = express();

const path = require('path');
const PORT = process.env.PORT || 10000;

const pairRoutes = require('./pair');

require('events').EventEmitter.defaultMaxListeners = 500;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/code', pairRoutes);

app.get('/pair', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'pair.html'));
});

app.get('/', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'main.html'));
});

// Start Server
const server = app.listen(PORT, '0.0.0.0', async () => {
    console.log(`
╔══════════════════════════════════════╗
║        👑 QUEEN BELLA PAIR API       ║
╠══════════════════════════════════════╣
║ ✅ Server Status : ONLINE            ║
║ 🌐 Port          : ${PORT}
║ 🚀 Ready for Pair Requests           ║
╚══════════════════════════════════════╝
`);

    // Auto reconnect saved sessions
    setTimeout(async () => {
        try {
            const { autoReconnectFromMongoDB } = require('./pair');

            if (typeof autoReconnectFromMongoDB === "function") {
                await autoReconnectFromMongoDB();
                console.log("✅ QUEEN BELLA auto-reconnect completed.");
            }
        } catch (err) {
            console.error("❌ Auto-reconnect failed:", err.message);
        }
    }, 5000);
});

module.exports = { app, server };