const { Rcon } = require('rcon-client');

module.exports = async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    // Handle preflight request
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    const { host, port, password, command } = req.body;

    if (!host || !port || !password || !command) {
        return res.status(400).json({ success: false, message: "Missing parameters" });
    }

    try {
        const rcon = await Rcon.connect({
            host: host,
            port: parseInt(port),
            password: password,
            timeout: 5000 // 5s timeout
        });

        const response = await rcon.send(command);
        await rcon.end();

        res.status(200).json({ success: true, response: response });
    } catch (error) {
        console.error("RCON Error:", error);
        res.status(500).json({ success: false, message: error.message || "RCON Connection Failed" });
    }
};