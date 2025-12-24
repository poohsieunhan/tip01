'use strict'
const amqp = require('amqplib');

async function consumerOrderedMessage() {
    const connection = await amqp.connect('amqp://guest:guest@localhost:5672');
    const channel = await connection.createChannel();

    const queueName = 'ordered-queue-message';
    await channel.assertQueue(queueName, { durable: true });

    for (let i = 0; i < 10; i++) {
        const message = `ordered-queue-message: ${i}`;
        console.log(`message: ${message}`);
        channel.sendToQueue(queueName, Buffer.from(message), { persistent: true });
    }
     
    setTimeout(() => {
        connection.close();
    }, 1000);
}

consumerOrderedMessage().catch(console.error);