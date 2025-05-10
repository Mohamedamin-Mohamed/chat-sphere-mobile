const searchQuery = async (email: string, query: string, controller: AbortController) => {
    const url = process.env.EXPO_PUBLIC_BACKEND_URL

    return await fetch(`${url}/api/users/search?requesterEmail=${email}&query=${encodeURIComponent(query)}`, {
        method: 'GET',
        headers: {
            'Content-type': 'application/json'
        },
        signal: controller.signal
    })
}

export default searchQuery