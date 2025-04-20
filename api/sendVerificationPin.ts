interface sendVerificationPinProps {
    phoneNumber: string,
    email: string
}

const sendVerificationPin = async (request: sendVerificationPinProps, controller: AbortController) => {
    const url = process.env.EXPO_PUBLIC_BACKEND_URL

    return await fetch(`${url}/api/twilio/code/send`, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(request),
        signal: controller.signal
    })
}

export default sendVerificationPin