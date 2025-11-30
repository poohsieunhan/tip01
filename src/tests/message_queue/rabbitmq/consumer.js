const amqp = require('amqplib');


const runConsumer = async () => {
    try {
        const connection = await amqp.connect('amqp://guest:guest@localhost:5672');
        const channel = await connection.createChannel();

        const queueName = 'test_queue';
        await channel.assertQueue(queueName, { durable: true });

        channel.consume(queueName, (msg) => {
            console.log(`Received message from queue: ${msg.content.toString()}`);
        },{
            noAck: true
        });
        console.log(`Message sent to queue: ${messages}`);

    } catch (error) {
        console.log('Error in consumer:', error);
    }
}

runConsumer().catch(console.error);