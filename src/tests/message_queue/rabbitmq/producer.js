const amqp = require('amqplib');

const messages = 'Hello World! from Producer';

const runProducer = async () => {
    try {
        const connection = await amqp.connect('amqp://guest:guest@localhost:5672');
        const channel = await connection.createChannel();

        const queueName = 'test_queue';
        await channel.assertQueue(queueName, { durable: true });

        channel.sendToQueue(queueName, Buffer.from(messages), { persistent: true });
        console.log(`Message sent to queue: ${messages}`);

    } catch (error) {
        console.log('Error in producer:', error);
    }
}

runProducer().catch(console.error);