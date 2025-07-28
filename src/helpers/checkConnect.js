const mongoose = require('mongoose');
const os = require('os');
const process = require('process');

const _SECOND = 5000;

const countConnect = () => {
    const numConnections = mongoose.connections.length;
    console.log(`Number of active connections: ${numConnections}`);
}

const checkOverload = () => {
    setInterval(() => {
        const numConnections = mongoose.connections.length;
        const numCores = os.cpus().length;
        const memoryUsage = process.memoryUsage().rss
        const maxConnections = numCores * 5; // Example threshold based on CPU cores

        console.log(`Number of connections: ${numConnections}`);
        console.log(`Number of CPU cores: ${numCores}`);
        console.log(`Current memory usage: ${memoryUsage / 1024 / 1024} MB`);

        if (numConnections > maxConnections ) { // Example threshold
            console.log(`Warning: High number of connections detected! Current: ${numConnections}, Max allowed: ${maxConnections}`);
        }
    }, _SECOND); // Check every 5 seconds
}

module.exports = {
    countConnect,
    checkOverload
}