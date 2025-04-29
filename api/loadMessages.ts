const loadMessages = async (email: string, controller: AbortController) => {
    const url = process.env.EXPO_PUBLIC_BACKEND_URL

    return await fetch(`${url}/auth/message/messages?email=${email}`, {
        method: 'GET',
        headers: {
            'Content-type': 'application/json'
        },
        signal: controller.signal
    })
}

export default loadMessages