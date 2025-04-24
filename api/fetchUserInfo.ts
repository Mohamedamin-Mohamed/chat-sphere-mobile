const fetchUserInfo = async (token: string) => {
    const url = process.env.EXPO_PUBLIC_GOOGLE_APIS

    return await fetch(url, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
}
export default fetchUserInfo