const amqp = require('amqplib');
const { set } = require('lodash');

const messages = 'Hello World! from Producer';

const runProducer = async () => {
    try {
        const connection = await amqp.connect('amqp://guest:guest@localhost:5672');
        const channel = await connection.createChannel();

        const notificationExchange = 'notificationEX';
        const notiQueue = 'notificationQueueProcess';
        const notificationExchangeDLX = 'notificationEXDLX';
        const notificationRoutingKeyDLX = 'notificationRoutingKeyDLX';

        //1. Assert the dead-letter exchange
        await channel.assertExchange(notificationExchangeDLX, 'direct', { durable: true });

        //2. create queue with DLX settings
        const queueResult = await channel.assertQueue(notiQueue, {
            exclusive: false, // cho phep cac ket noi truy cap vao dung chung hang doi
            deadLetterExchange: notificationExchangeDLX, // cau hinh dead-letter exchange
            deadLetterRoutingKey: notificationRoutingKeyDLX // cau hinh dead-letter routing key
        })

        //3. Bind the queue to the default exchange with routing key as queue name
        await channel.bindQueue(queueResult.queue,notificationExchange);

        //4. Send message to the queue
        const msg = 'a new product created';
        await channel.sendToQueue(queueResult.queue, Buffer.from(msg), { expiration: '10000' }); // tin nhan se het han sau 10 giay
        console.log(`Message sent to queue: ${msg}`);
        
        setTimeout(() => {
            connection.close();
            process.exit(0);
        }, 500 );

    } catch (error) {
        console.log('Error in producer:', error);
    }
}

runProducer().catch(console.error);