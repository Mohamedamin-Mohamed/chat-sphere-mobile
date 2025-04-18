const sanitizeUser = (user: Record<string, string>) => {
    const sanitizedUser: Record<string, string> = {}
    for (const key in user) {
        sanitizedUser[key] = user[key] === null ? "" : user[key]
    }
    return sanitizedUser
}
export default sanitizeUser