import {FollowInteraction} from "../types/types";

const followUser = async (request: FollowInteraction, controller: AbortController) => {
    console.log('Request is ', request)
    const url = process.env.EXPO_PUBLIC_BACKEND_URL

    return await fetch(`${url}/api/follow/add`, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(request),
        signal: controller.signal
    })
}

export default followUser