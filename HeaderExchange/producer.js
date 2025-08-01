const amqp = require("amqplib");

async function sendNotification(headers,message){
    try {
        const connection = await amqp.connect("amqp://localhost");
        const channel = await connection.createChannel();

        const exchange = "header_exchange";
        const exchangeType = "headers";
        
        // create the exchange with name and it's type
        await channel.assertExchange(exchange,exchangeType,{durable:true});

        // there is not routing key, message will passed to the queue via header matches
        channel.publish(exchange,"",Buffer.from(message),{
            persistent:true,
            // sending the header for matching
            headers
        });
        console.log("Message sent with header");

        setTimeout(()=>{
            connection.close();
        },500)
    } catch (error) {
        console.log("Error while sending the notification");
    }
}

// Using x-match: "all" => Message will go only to queues that match **all** header keys/values
sendNotification({ "x-match": "all", "notification-type": "new_video", "content-type": "video" },"New Video Uploaded");

// Using x-match: "all" => All headers must match
sendNotification({ "x-match": "all", "notification-type": "live_stream", "content-type": "gaming" },"Gaming live stream started");

// Using x-match: "any" => Message will go to queues that match **any one** of the headers
sendNotification({ "x-match": "any", "notification-type-comment": "comment", "content-type": "vlog" },"New comment on your blog");

// Same with "like"
sendNotification({ "x-match": "any", "notification-type-like": "like", "content-type": "vlog" },"New like on your blog");
