'use strict'
const amqp = require('amqplib');

async function consumerOrderedMessage() {
    const connection = await amqp.connect('amqp://guest:guest@localhost:5672');
    const channel = await connection.createChannel();

    const queueName = 'ordered-queue-message';
    await channel.assertQueue(queueName, { durable: true });

    channel.prefetch(1);

    channel.consume(queueName, (msg) => {
        const message = msg.content.toString();
        console.log(`message: ${message}`);

        setTimeout(() => {
            console.log(`ack message: ${message}`);
            channel.ack(msg);
        }, Math.random()*1000);

    })
      
}

consumerOrderedMessage().catch(console.error);