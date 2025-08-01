const amqp = require("amqplib");

async function pushNotification() {
    try {
        const connection = await amqp.connect("amqp://localhost");
        const channel = await connection.createChannel();

        const exchange = "new_product_launch";
        const exchangeType = "fanout";
        
        // to make sure that exchange will exist, if consumer start before the producer
        await channel.assertExchange(exchange,exchangeType,{durable:true});

        // create the queue without name {exclusive:true}-> queue will be autoDelete one processes
        const queue = await channel.assertQueue("",{exclusive:true});
        console.log("Waiting for message: ", queue);

        // find the queue with exchange with not routing key
        // why queue.queue 
        // queue contains object returns by assertQueue:
        /*
            {
                queue: 'amq.gen-RANDOM_STRING', // random name
                messageCount: 0,
                consumerCount: 0
            }
        */

        // bind the queue with exchange for receiving the messages
        await channel.bindQueue(queue.queue,exchange,"");

        channel.consume(queue.queue,(message)=>{
            if(message !== null){
                const product = JSON.parse(message.content.toString());
                console.log("Sending Push Notification for product: ", product?.name);
                channel.ack(message);
            }   
        })
    } catch (error) {
        console.log("Error while pushNotification");
    }
};

pushNotification();