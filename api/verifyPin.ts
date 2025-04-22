interface VerifyPinProps {
    email: string,
    phoneNumber: string,
    pin: string,
}

const verifyPin = async (request: VerifyPinProps, controller: AbortController) => {
    const url = process.env.EXPO_PUBLIC_BACKEND_URL

    return await fetch(`${url}/api/twilio/code/verify`, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(request)
    })
}

export default verifyPin