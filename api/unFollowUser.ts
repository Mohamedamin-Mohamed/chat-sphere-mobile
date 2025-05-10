import {FollowInteraction} from "../types/types";

const unFollowUser = async (request: FollowInteraction, controller: AbortController) => {
    const url = process.env.EXPO_PUBLIC_BACKEND_URL

    return await fetch(`${url}/api/follow/remove`, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(request),
        signal: controller.signal
    })
}

export default unFollowUser