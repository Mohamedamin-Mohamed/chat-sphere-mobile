import {Conversation, EmbeddingType} from "../types/types";
import api from "./api";

const askChatGPT = async (request: EmbeddingType[], question: string, lastQuestions: Conversation[], controller: AbortController) => {
    lastQuestions.sort((a, b) => {
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    })

    const chatSphereBio = process.env.EXPO_PUBLIC_CHATSPHERE_BIO
    const header = process.env.EXPO_PUBLIC_HEADER_MESSAGE
    const message = process.env.EXPO_PUBLIC_SUB_HEADER_MESSAGE
    const lastQuestionsMessage = process.env.EXPO_PUBLIC_LAST_HEADER_MESSAGE

    const formattedRequest = request.map(val => ({
        role: 'system',
        content: `Question: ${val.question}, Answer: ${val.answer} and timestamp is ${val.timestamp}`
    }))

    const formatLastQuestions = lastQuestions.map(val => ({
        role: 'system',
        content: val.sender === 'user' ? 'Question' : 'Answer' + ` is ${val.message} and timestamp is ${val.timestamp}`
    }))

    const messages = [
        {role: 'system', content: chatSphereBio},
        {role: 'system', content: header},
        {role: 'system', content: message},
        ...formattedRequest,
        {role: 'system', content: lastQuestionsMessage},
        ...formatLastQuestions,
        {role: 'user', content: question}
    ]

    return await api.post('api/chat/completions', messages)
}

export default askChatGPT