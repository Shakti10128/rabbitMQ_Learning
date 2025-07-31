const amqp = require("amqplib");

async function sendEmail() {
    try {
        const connection = await amqp.connect("amqp://localhost");
        const channel = await connection.createChannel();

        const exchange = "mail_exchange";
        const routing_key = "send_mail";
        const queue = "mail_queue";

        // Assert Exchange and Queue with durable: true
        await channel.assertExchange(exchange, "direct", { durable: true});
        await channel.assertQueue(queue, { durable: true});

        // Bind queue to the exchange with the routing key
        await channel.bindQueue(queue, exchange, routing_key);

        const message = {
            to: "aashutejaan1@gmail.com",
            from: "aashishkumar1@gmail.com",
            subject: "Time Pass1",
            content: "Time pass message for you"
        };

        console.log("Publishing message...");
        channel.publish(exchange, routing_key, Buffer.from(JSON.stringify(message)));
        console.log("Published.");
        console.log("Mail sent successfully:", message);

        // Give RabbitMQ time to process
        setTimeout(() => {
            connection.close();
        }, 500);

    } catch (error) {
        console.log("Something went wrong:", error.message);
    }
}

sendEmail();
