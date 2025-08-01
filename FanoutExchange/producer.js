const amqp = require("amqplib");

async function announceNewProduct(product) {
    try {
        const connection = await amqp.connect("amqp://localhost");
        const channel = await connection.createChannel();

        const exchange = "new_product_launch";
        const exchangeType = "fanout";

        // Declare a fanout exchange (durable so it survives broker restarts)
        await channel.assertExchange(exchange, exchangeType, { durable: true });

        const message = JSON.stringify(product);

        // Publish to all queues bound to this exchange (routing key is ignored)
        const published = channel.publish(exchange, "", Buffer.from(message), {
            persistent: true // message survives broker restart if queues are also durable
        });

        if (published) {
            console.log("✅ Message sent =>", message);
        } else {
            console.log("⚠️ Message was not sent");
        }

        // Allow RabbitMQ time to flush before closing connection
        setTimeout(() => {
            connection.close();
        }, 500);

    } catch (error) {
        console.log("❌ Error while sending the message:", error.message);
    }
}

announceNewProduct({ id: 321, name: "iPhone 29 Pro", price: 250000 });
