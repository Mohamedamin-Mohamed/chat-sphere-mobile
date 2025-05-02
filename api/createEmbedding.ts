interface createEmbeddingProps {
    question: string,
    answer: string
}

const createEmbedding = async (request: createEmbeddingProps, controller: AbortController) => {
    const url = process.env.EXPO_PUBLIC_BACKEND_URL

    return await fetch(`${url}/api/embeddings`, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(request),
        signal: controller.signal
    })
}

export default createEmbedding