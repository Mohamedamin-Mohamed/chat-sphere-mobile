const getUserStats = async (email: string, controller: AbortController) => {
    const url = process.env.EXPO_PUBLIC_BACKEND_URL

    return await fetch(`${url}/api/users/stats?email=${email}`, {
        method: 'GET',
        signal: controller.signal
    })
}

export default getUserStats
