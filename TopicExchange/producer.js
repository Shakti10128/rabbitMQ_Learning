const amqp = require("amqplib");

async function sendMessage(routingKey,message){
    try {
        const connection = await amqp.connect("amqp://localhost");
        const channel = await connection.createChannel();

        const exchange = "notification_exchange";
        const exchangeType = "topic";

        await channel.assertExchange(exchange,exchangeType,{durable:true});

        channel.publish(exchange,routingKey,Buffer.from(JSON.stringify(message)),{persistent:true});
        console.log(" [x] send '%s':'%s' ", routingKey, Buffer.from(JSON.stringify(message)));
        console.log(`Message was send with routing key ${routingKey} and content as ${routingKey, Buffer.from(JSON.stringify(message))}`);

        setTimeout(()=>{
            connection.close();
        },500)

    } catch (error) {
        console.log("something went wrong");
    }
}

sendMessage("order.placed",{orderId:1234,status:"placed"});
sendMessage("payment.processed",{paymentId:654332,status:"processed"});