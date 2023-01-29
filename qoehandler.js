function checkBitrate(bitrate, width) {
    if (bitrate != 0 && width != 0) {
        console.log("Minimum bps: ", calculateMinimumBitrate(width));
        console.log("Current bps: ", bitrate);
        console.log(width);
        if (bitrate < calculateMinimumBitrate(width)) {
            console.log("bitrate: ", bitrate);
            console.log(width);
            return "The bitrate is too low for the given frame size. Consider increasing the bitrate or reducing the frame size.";
        } else {
            return "OK";
        }
    }
    return "OK";
}

function calculateMinimumBitrate(width) {
    switch (true) {
        case width >= 1080:
            return 4.69 * 1000000;
        case width >= 720:
            return 3.39 * 1000000;
        case width >= 540:
            return 1.49 * 1000000;
        case width >= 360:
            return 0.641 * 1000000;
        case width >= 180:
            return 0.392 * 1000000;
        default:
            return 0;
    }
}

let bitrateSwitches = 0;
let lastBitrate;
let lastSwitchTime;
let warning = false;

function checkBitrateSwitches(currentBitrate) {
  if (lastBitrate && lastBitrate !== currentBitrate) {
    bitrateSwitches++;
    const currentTime = new Date();
    if (currentTime - lastSwitchTime <= 10000) { // check if current switch happened within 10 seconds of previous switch
      if (bitrateSwitches >= 2) {
        lastSwitchTime = currentTime;
        lastBitrate = currentBitrate;
        warning = true;
        return "Number of bitrate switches is higher than 2 in the last 10 seconds.";
      } 
    } 
   
    lastSwitchTime = currentTime;
  } else if (warning && (new Date() - lastSwitchTime <= 10000)) { 
    // Continue to deliver warning message if there wasn't a switch but the 10 seconds hasn't passed from last time
    return "Number of bitrate switches is higher than 2 in the last 10 seconds.";
  }
  lastBitrate = currentBitrate;
  warning = false;
  return "OK";
}

let buffers = 0;
let longBufferTimestamps = [];
//let longBufferTimestamps = [new Date("2023-01-29T14:27:09.182Z"), new Date("2023-01-29T14:27:22.216Z"), new Date("2023-01-29T14:27:30.216Z")];
function checkBufferWarnings(bufferEventTimes) {
    let warning = "";

    if (buffers != bufferEventTimes.length) {  

        if (bufferEventTimes[bufferEventTimes.length-1] > 500) {
            console.log("500 ms buffer event detected, add to array: ", bufferEventTimes[bufferEventTimes.length-1]);
            longBufferTimestamps.push(new Date());
        }
        buffers = bufferEventTimes.length;
    }

    for (let i = 0; i < bufferEventTimes.length; i++) {
        if (bufferEventTimes[i] > 1000) {
            warning += "Buffering event longer than 1 second detected! ";
            break;
        }
    }

    // Check if three or more timestamps are within 30 seconds of each other
    for (let i = 0; i < longBufferTimestamps.length - 2; i++) {
        if (longBufferTimestamps[i + 2] - longBufferTimestamps[i] <= 30000) {
            warning += "Three or more buffer events longer than 500 ms within 30 seconds detected! ";
            break;
        }
    }

    if (warning === "") {
        return "OK";
    } else {
        return warning;
    }
}

module.exports = {
    checkBitrate: checkBitrate,
    checkBitrateSwitches: checkBitrateSwitches,
    checkBufferWarnings: checkBufferWarnings
};
