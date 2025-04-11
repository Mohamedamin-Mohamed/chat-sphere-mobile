export type User = {
    email: string,
    name: string,
    oauthProvider: string | null
    picture: string | null
    signupDate: string
}
export type UserSignUp = {
    email: string,
    name: string,
    password: string
}
export type SetUserInfoPayload = {
    [k in keyof User]?: User[k]
}
export type Error = {
    email: string,
    password: string
}
export type RootState = {
    userInfo: User
}
export type Buttons = {
    icon: string,
    name: string,
    navigateTo: string
}