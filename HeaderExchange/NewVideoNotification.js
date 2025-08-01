const amqp = require('amqplib');

const consumeNewVideoNotification = async()=>{
    try {
        const connection = await amqp.connect("amqp://localhost");
        const channel = await connection.createChannel();

        const exchange = "header_exchange";
        const exchangeType = "headers";

        // create exchange if not already exist
        await channel.assertExchange(exchange,exchangeType,{durable:true});

        // creating the queue
        const queue = await channel.assertQueue("",{exclusive:true});
        console.log("Waiting for the new video notification");

        // let's bind the queue
        await channel.bindQueue(queue.queue,exchange,"",{
            "x-match":"all",
            "notification-type":"new_video",
            "content-type":"video"
        })

        channel.consume(queue.queue,(message)=>{
            if(message !== null){
                console.log("Message Received: ",message.content.toString());
                // sending the acknowledgement
                channel.ack(message);
            }
        })

    } catch (error) {
        console.log("Error while consuming the new video");
    }
}

consumeNewVideoNotification();