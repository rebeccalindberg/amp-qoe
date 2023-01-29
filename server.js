const express = require("express");
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const qoeHandler = require("./qoehandler");

app.use(cors({
    origin: "*"
}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post("/telemetry", async (req, res) => {
    console.log(req.body);
    let checkBitrateRes = qoeHandler.checkBitrate(req.body.bitrateSwitchedTo, req.body.width, req.body.height);
    let checkBitrateSwitchesRes = qoeHandler.checkBitrateSwitches(req.body.bitrateSwitchedTo);
    let checkBufferRes = qoeHandler.checkBufferWarnings(req.body.bufferTime)

    // Return indexes in a json object
    res.status(200).json({ 
        HIGHEST_BITRATE_POSSIBLE: checkBitrateRes,
        TOO_MANY_BITRATE_SWITCHES: checkBitrateSwitchesRes,
        TOO_MANY_BUFFERING: checkBufferRes
    });
});

app.listen(3000, () => console.log("Server is running on port 3000"));