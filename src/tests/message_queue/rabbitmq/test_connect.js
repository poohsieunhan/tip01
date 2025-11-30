const amqp = require('amqplib');

const url = 'amqp://guest:guest@localhost:5672'; 

(async () => {
  try {
    const conn = await amqp.connect(url);
    console.log('✅ Connected OK to RabbitMQ');
    await conn.close();
  } catch (err) {
    console.error('❌ Connect error:', err.message);
    console.error(err); // in full stack + thông tin server gửi về
  }
})();
