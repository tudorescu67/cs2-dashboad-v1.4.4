const { Rcon } = require('rcon-client');

module.exports = async (req, res) => {
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
        res.status(500).json({ success: false, message: error.message });
    }
};