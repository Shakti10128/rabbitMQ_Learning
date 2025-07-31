const amqp = require("amqplib");

async function receiveMessage(){
    try {
        const connection = await amqp.connect("amqp://localhost");
        const channel = await connection.createChannel();

        const exchange = "notification_exchange";
        const queue = "payment_queue";

        await channel.assertExchange(exchange,'topic',{durable:true});
        await channel.assertQueue(queue,{durable:true});

        await channel.bindQueue(queue,exchange,"payment.*");

        console.log("waiting for messages");
        channel.consume(queue,(message)=>{
            if(message !== null){
                console.log(`[Payment Notification] Msg was conusmed! with routing ${message.fields.routingKey} and content as ${message.content.toString()}`);
                channel.ack(message);
            }
        },{noAck:false});

    } catch (error) {
        console.log("something went wrong in receiveMessage for payment Notification")
    }
}

receiveMessage();