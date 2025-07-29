import {Client} from "@stomp/stompjs";

const baseURL = process.env.EXPO_PUBLIC_BACKEND_URL

const client = new Client({
    brokerURL: `ws://${baseURL}/gs-guide-websocket`,
    reconnectDelay: 5000,
    onConnect: () => {
        console.log("Connected")
        client.subscribe("/topics/chat", message => {
            console.log(`Message received: ${message.body}`)
        })
    }
})

client.activate()

export default client