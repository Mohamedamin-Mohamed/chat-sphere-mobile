import {ScrollView, StyleSheet,} from "react-native";

import React, {useEffect, useRef, useState} from "react";
import {useSelector} from "react-redux";
import {Conversation, EmbeddingType, RootState} from "../../../types/types";
import askChatGPT from "../../../api/askChatGPT";
import Toast from "react-native-toast-message";
import {format} from "date-fns";
import api from "../../../api/api";
import axios from "axios";
import ChatInterface from "../../../components/ChatInterface";

const Index = () => {
    const [message, setMessage] = useState("");
    const userInfo = useSelector((state: RootState) => state.userInfo);
    const email = userInfo.email;
    const [conversation, setConversation] = useState<Conversation[]>([]);
    const [initialLoading, setInitialLoading] = useState(true);
    const [disabled, setDisabled] = useState(false);
    const [showTypingIndicator, setShowTypingIndicator] = useState(false);
    const scrollViewRef = useRef<ScrollView>(null);

    const handleSend = async () => {
        if (message === '') return;
        scrollViewRef.current?.scrollToEnd({animated: true})

        const date = new Date();
        const userQuestion = {sender: 'user', message: message.trim(), timestamp: date};
        const currentMsg = message;

        setMessage('');
        try {
            setConversation(prevState => [...prevState, userQuestion]);
            /**Create an embedding of the user's current message. This embedding will be used to retrieve the top-k most
             * semantically similar question–answer pairs. A prompt should then be constructed by combining the top-k
             * retrieved Q&A pairs (as context) with the user's question. This prompt is sent to the LLM to provide
             * relevant context and improve the quality of the answer.
             */

            scrollViewRef.current?.scrollToEnd({animated: true})
            const request = {question: userQuestion.message}
            const searchEmbeddingResponse = await api.post('api/embeddings/search', request)
            let tempRequest: EmbeddingType[] = searchEmbeddingResponse.data
            setShowTypingIndicator(true);

            const lastFourConversation = conversation.slice(-4)

            const chatCompletionsResponse = await askChatGPT(tempRequest, currentMsg, lastFourConversation, new AbortController());
            const data = chatCompletionsResponse.data
            const gptMessageContent = data.choices[0].message.content;

            const embeddingsRequest = {
                question: userQuestion.message,
                answer: gptMessageContent,
                timestamp: date
            }
            /**
             * We send a request to create an embedding of the user's question, and the question–answer pair is stored
             * in OpenSearch as a vector entry.
             */
            await api.post('api/embeddings/', embeddingsRequest)

            setShowTypingIndicator(false);
            const gptMessage = {sender: 'gpt', message: gptMessageContent, timestamp: new Date()};
            setConversation(prevState => [...prevState, gptMessage]);

            if (gptMessage.message.length > 450) {
                gptMessage.message = "Response length exceeded. Try rephrasing or asking for less detail."
            }

            await Promise.all([
                api.post('api/message', {...userQuestion, email: email}),
                api.post('api/message', {...gptMessage, email: email})
            ])

        } catch (exp: any) {
            setShowTypingIndicator(false);
            if (exp.response) {
                const message = exp.response.statusText
                //showToastMessage(false, message, "Error Occurred")
            } else if (exp.response.statusText === 500) {
                const splitMessage = exp.response.message.split(' ')
                const message = splitMessage.slice(0, 3).join(' ')

                setShowTypingIndicator(false)
                showToastMessage(false, message)
            } else {
                showToastMessage(false, 'Failed to send request. Please try again.', 'Network Error')
            }
        } finally {
            setShowTypingIndicator(false)
        }
    }

    const showToastMessage = (success: boolean, message: string, header?: string) => {
        Toast.show({
            type: success ? 'success' : 'error',
            ...(header ? {tex1: header, text2: message} : {tex1: message}),
            onShow: () => setDisabled(true),
            onHide: () => setDisabled(false)
        })
    }

    const getMessages = async () => {
        try {
            setInitialLoading(true);
            const response = await api.get(`api/message`, {
                params: {email}
            })
            const messages = response.data;
            const sortedMessages = [...messages].sort((a, b) => {
                return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
            });

            const fixedOrderMessages = await ensureProperMessageOrder(sortedMessages);

            setConversation(fixedOrderMessages);

            setTimeout(() => {
                scrollViewRef.current?.scrollToEnd({animated: true});
            }, 500)
        } catch (exp: any) {
            if (axios.isAxiosError(exp) && exp.response) {

            } else {
                console.error(exp);
            }
        } finally {
            setInitialLoading(false);
        }
    }

    useEffect(() => {
        getMessages().catch(err => console.error(err))
    }, [])

    const ensureProperMessageOrder = async (messages: Conversation[]): Promise<Conversation[]> => {
        const result: Conversation[] = [];
        let lastSender: string | null = null;

        for (const message of messages) {
            // First message or different sender from last message - normal case
            if (lastSender === null || message.sender !== lastSender) {
                result.push(message);
                lastSender = message.sender;
                continue;
            }

            // Same sender as last message - need to find a proper place for it
            if (message.sender === 'user') {
                // If we have two user messages in a row, we need to find or create a gpt message to put between them
                const placeholderTimestamp = new Date(message.timestamp);
                placeholderTimestamp.setMilliseconds(placeholderTimestamp.getMilliseconds() - 1);
                const placeholderMessage: Conversation = {
                    sender: 'gpt',
                    message: 'Oops, I didn’t catch that. Want to try again?',
                    timestamp: placeholderTimestamp
                };
                try {
                    await api.post('auth/message/create', {...placeholderMessage, email: email})
                } catch (exp) {
                    console.error(exp)
                }
                result.push(placeholderMessage);
                result.push(message);
            } else {
                // If we have two gpt messages in a row, regroup them by putting the latest one at the end
                result.push(message);
            }

            lastSender = message.sender;
        }

        return result;
    };

    const formatDate = (timestamp: Date): string => {
        const messageDate = new Date(timestamp);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (messageDate.toDateString() === today.toDateString()) {
            return "Today";
        } else if (messageDate.toDateString() === yesterday.toDateString()) {
            return "Yesterday";
        } else if (today.getFullYear() === messageDate.getFullYear()) {
            return format(messageDate, 'MMMM dd');
        } else {
            return format(messageDate, 'MMMM dd, yyyy');
        }
    }

    const groupedMessages = conversation.reduce((groups: Record<string, Conversation[]>, message: Conversation) => {
        const date = formatDate(new Date(message.timestamp));
        if (!groups[date]) {
            groups[date] = [];
        }
        groups[date].push(message);
        return groups;
    }, {})

    const sortedDates = Object.keys(groupedMessages).sort((a, b) => {
        const dateA = new Date(groupedMessages[a][0].timestamp)
        const dateB = new Date(groupedMessages[b][0].timestamp)
        return dateA.getTime() - dateB.getTime()
    })

    return (
        <ChatInterface initialLoading={initialLoading}
                       disabled={disabled}
                       showTypingIndicator={showTypingIndicator}
                       handleSend={handleSend}
                       message={message}
                       setMessage={setMessage}
                       getMessages={getMessages}
                       scrollViewRef={scrollViewRef}
                       conversation={conversation}
                       sortedDates={sortedDates}
                       groupedMessages={groupedMessages}
        />
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFFFFF",
    },
    keyboardAvoidView: {
        flex: 1,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: "#F1F5F9",
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: "700",
        color: "#0f172a",
    },
    scrollContainer: {
        flexGrow: 1,
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    emptyStateContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 100,
    },
    initialLoadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 16,
        color: "#64748b",
    },
    dateGroup: {
        marginBottom: 20,
    },
    dateHeaderContainer: {
        alignItems: 'center',
        marginVertical: 16,
    },
    dateHeader: {
        fontSize: 14,
        fontWeight: "500",
        color: "#64748b",
        paddingHorizontal: 12,
        paddingVertical: 4,
        backgroundColor: "#F1F5F9",
        borderRadius: 12,
        overflow: 'hidden',
    },
    userLabel: {
        alignSelf: "flex-end",
        marginRight: 8,
        marginBottom: 2,
        fontSize: 12,
        fontWeight: "500",
        color: "#3b82f6",
    },
    gptLabel: {
        alignSelf: "flex-start",
        marginLeft: 8,
        marginBottom: 2,
        fontSize: 12,
        fontWeight: "500",
        color: "#64748b",
    },
    userMessage: {
        backgroundColor: "#EFF6FF",
        padding: 12,
        borderRadius: 16,
        borderBottomRightRadius: 4,
        maxWidth: '85%',
        alignSelf: "flex-end",
        marginBottom: 2,
        borderWidth: 1,
        borderColor: "#DBEAFE",
    },
    gptMessage: {
        backgroundColor: "#F8FAFC",
        padding: 12,
        borderRadius: 16,
        borderBottomLeftRadius: 4,
        maxWidth: '85%',
        alignSelf: "flex-start",
        marginBottom: 2,
        borderWidth: 1,
        borderColor: "#F1F5F9",
    },
    userMessageText: {
        fontSize: 15,
        color: "#1e293b",
        lineHeight: 22,
    },
    gptMessageText: {
        fontSize: 15,
        color: "#334155",
        lineHeight: 22,
    },
    messageTime: {
        fontSize: 10,
        color: "#94a3b8",
        alignSelf: "flex-end",
        marginTop: 4,
    },
    arrowDownView: {
        position: 'relative',
        alignItems: 'flex-end',
        paddingHorizontal: 16,
    },
    arrowDownViewButton: {
        borderRadius: 8,
    },
    typingIndicatorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 24,
        minWidth: 60,
    },
    typingDot: {
        width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    greetingText: {
        fontSize: 24,
        fontWeight: "700",
        color: "#0f172a",
        marginTop: 20,
    },
    subText: {
        fontSize: 16,
        color: "#64748b",
        marginTop: 8,
        textAlign: "center",
    },
    newSenderGroup: {
        marginTop: 16,
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: "#F1F5F9",
        backgroundColor: "#FFFFFF",
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: "#0f172a",
        backgroundColor: "#F1F5F9",
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 14,
        paddingRight: 40,
        maxHeight: 120,
    },
    sendButton: {
        backgroundColor: "#3b82f6",
        borderRadius: 20,
        width: 40,
        height: 40,
        justifyContent: "center",
        alignItems: "center",
        position: "absolute",
        right: 24,
    },
    sendButtonDisabled: {
        backgroundColor: "#94a3b8",
    },
});

export default Index;