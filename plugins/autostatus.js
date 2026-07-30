async function handleStatusUpdate(conn, chatUpdate) {
    try {
        const mek = chatUpdate.messages[0];
        if (!mek) return;
        await conn.readMessages([mek.key]);
        console.log('✅ Status viewed automatically');
    } catch (error) {
        console.error('Error in status update:', error);
    }
}

module.exports = { handleStatusUpdate }