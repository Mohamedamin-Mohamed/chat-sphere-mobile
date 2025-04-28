const askChatGPT = async (question: string) => {
    const url = process.env.EXPO_PUBLIC_CHATGPT_CHAT_URL
    const apiKey = process.env.EXPO_PUBLIC_OPENAI_APIKEY

    const dateInfo = process.env.EXPO_PUBLIC_DATE_INFO
    const chatSphereBio = process.env.EXPO_PUBLIC_CHATSPHERE_BIO

    const messages = [
        {role: 'system', content: dateInfo},
        {
            role: 'system',
            content: chatSphereBio
        },
        {role: 'user', content: question}
    ]

    return await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
            'model': 'gpt-3.5-turbo',
            messages: messages,
            'max_tokens': 50
        })
    })
}

export default askChatGPT