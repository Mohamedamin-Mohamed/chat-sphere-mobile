export type User = {
    email: string,
    name: string,
    oauthProvider: string | null
    picture: string | null
    createdAt: string,
    bio: string,
    phoneNumber: string
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
export type OauthSignUp = {
    email?: string | null,
    name?: string,
    oauthId?: string,
    oauthProvider: string,
    picture?: string,
    emailVerified?: boolean,
    authorizationCode?: string | null,
    accessToken?: string,
    identityToken?: string | null,
}

export interface Conversation {
    messageId?: string,
    sender: string,
    message: string,
    timestamp: Date
}

export interface Message extends Conversation {
    email: string
}

export type EmbeddingType = {
    question: string,
    answer: string,
    timestamp: string
}

export type ProfilePictureDetails = {
    fileName: string,
    file: {
        uri: string | null,
        mimeType: string,
        fileSize: number
    }
}

export type UpdateProfileType = {
    email: string,
    newEmail?: string,
    name?: string,
    bio?: string,
    phoneNumber: string,
    profilePictureDetails?: ProfilePictureDetails
}

export type SearchUser = {
    email: string,
    name: string,
    bio: string,
    picture: string,
    joinedDate: string
    isOnline: boolean,
    followerSize: number,
    followingSize: number,
    followingRequester: boolean,
    followedByRequester: boolean,
}

export type FollowInteraction = {
    followerEmail: string,
    followingEmail: string
}

export type UserStats = {
    followers: string,
    followings: string
}