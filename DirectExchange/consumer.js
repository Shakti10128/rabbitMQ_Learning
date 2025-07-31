const amqp = require("amqplib");

async function recieveMail(){
    try {
        const connection = await amqp.connect("amqp://localhost");
        const channel = await connection.createChannel();
        // must assert the queue in the consumer to either create it (if it's not created yet) or ensure 
        // it's configured correctly before consuming from it.
        await channel.assertQueue("mail_queue",{durable:true});
        channel.consume("mail_queue",(message)=>{
            if(message !== null) {
                console.log("message recieved: ", JSON.parse(message.content));
                channel.ack(message); // message mil gya hai
            }
        })
    } catch (error) {
        console.log("Error while consuming the message")
    }
}

recieveMail();