import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    RefreshControl,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import React, {useEffect, useRef, useState} from "react";
import {useSelector} from "react-redux";
import {Conversation, EmbeddingType, RootState} from "../../../types/types";
import askChatGPT from "../../../api/askChatGPT";
import saveMessage from "../../../api/saveMessage";
import Toast from "react-native-toast-message";
import loadMessages from "../../../api/loadMessages";
import {format} from "date-fns";
import createEmbedding from "../../../api/createEmbedding";
import searchEmbeddings from "../../../api/searchEmbeddings";

const Index = () => {
    const [message, setMessage] = useState("");
    const userInfo = useSelector((state: RootState) => state.userInfo);
    const email = userInfo.email;
    const firstName = userInfo.name.split(" ")[0];
    const [conversation, setConversation] = useState<Conversation[]>([]);
    const [initialLoading, setInitialLoading] = useState(true);
    const [disabled, setDisabled] = useState(false);
    const [showTypingIndicator, setShowTypingIndicator] = useState(false);
    const scrollViewRef = useRef<ScrollView>(null);

    const handleSend = async () => {
        if (message === '') return;

        const date = new Date();
        const userQuestion = {sender: 'user', message: message.trim(), timestamp: date};
        const currentMsg = message;

        setMessage('');

        try {
            setConversation(prevState => [...prevState, userQuestion]);
            /**So create an embedding of the users current message, and this embedding will be used to retrieve the top-k most
             * semantically similar questions and answers pairs. A prompt should be built combining top-k retrieved
             * Q&A pairs (context) and the users question, which will be sent to the LLM to have relevant context to
             * give better answer.
             */

            const request = {question: userQuestion.message}
            const searchEmbeddingResponse = await searchEmbeddings(request, new AbortController());

            let tempRequest: EmbeddingType[] = []
            if (searchEmbeddingResponse.ok) {
                tempRequest = await searchEmbeddingResponse.json()
            } else {
                const message = await searchEmbeddingResponse.text()
                showToastMessage(false, message)
            }
            setTimeout(() => {
                scrollViewRef.current?.scrollToEnd({animated: true});
            }, 100);

            setShowTypingIndicator(true);
            setTimeout(() => {
                scrollViewRef.current?.scrollToEnd({animated: true});
            }, 100);

            const lastFourConversation = conversation.slice(-4)

            const response = await askChatGPT(tempRequest, currentMsg, lastFourConversation, new AbortController());
            const data = await response.json();

            if (response.status === 400) {
                const text = await response.text()
                showToastMessage(false, text);
                return
            } else if (response.status === 500) {
                const splitMessage = data.error.message.split(' ')
                const message = splitMessage.slice(0, 3).join(' ')

                setShowTypingIndicator(false)
                showToastMessage(false, message)
                return
            }
            const gptMessageContent = data.choices[0].message.content;

            const embeddingsRequest = {
                question: userQuestion.message,
                answer: gptMessageContent,
                timestamp: date
            }
            /**
             * Here we send a request to create an embedding of the users question, and both the question and answer pair
             * will be stored in OpenSearch as a vector store.
             */

            const embeddingResponse = await createEmbedding(embeddingsRequest, new AbortController())
            if (response.status === 500) {
                const message = await embeddingResponse.text()
                showToastMessage(false, message)
            }

            setShowTypingIndicator(false);
            const gptMessage = {sender: 'gpt', message: gptMessageContent, timestamp: new Date()};
            setConversation(prevState => [...prevState, gptMessage]);

            setTimeout(() => {
                scrollViewRef.current?.scrollToEnd({animated: true});
            }, 100);

            if (gptMessage.message.length > 450) {
                gptMessage.message = "Response length exceeded. Try rephrasing or asking for less detail."
            }

            const [userResponse, gptResponse] = await Promise.all([
                saveMessage({...userQuestion, email: email}, new AbortController()),
                saveMessage({...gptMessage, email: email}, new AbortController())
            ])

            if (!userResponse.ok || !gptResponse.ok) {
                const responseJson = userResponse.ok ? await gptResponse.json() : await userResponse.json();
                const errorMessage = responseJson.message;

                showToastMessage(false, errorMessage, 'Error occurred')
            }
        } catch (exp: any) {
            console.error(exp);
            setShowTypingIndicator(false);
            showToastMessage(false, 'Failed to send request. Please try again.', 'Error')
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
            const response = await loadMessages(email, new AbortController());
            if (response.ok) {
                const messages = await response.json();

                const sortedMessages = [...messages].sort((a, b) => {
                    return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
                });

                const fixedOrderMessages = await ensureProperMessageOrder(sortedMessages);

                setConversation(fixedOrderMessages);

                setTimeout(() => {
                    scrollViewRef.current?.scrollToEnd({animated: false});
                }, 500)
            } else {
                showToastMessage(false, 'Failed to load messages', 'Error')
            }
        } catch (error) {
            console.error(error);
        } finally {
            setInitialLoading(false);
        }
    };

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
                    await saveMessage({...placeholderMessage, email: email}, new AbortController())
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
    };

    const groupedMessages = conversation.reduce((groups: Record<string, Conversation[]>, message: Conversation) => {
        const date = formatDate(new Date(message.timestamp));
        if (!groups[date]) {
            groups[date] = [];
        }
        groups[date].push(message);
        return groups;
    }, {});

    const sortedDates = Object.keys(groupedMessages).sort((a, b) => {
        const dateA = new Date(groupedMessages[a][0].timestamp);
        const dateB = new Date(groupedMessages[b][0].timestamp);
        return dateA.getTime() - dateB.getTime();
    });


    const TypingIndicator = () => (
        <View>
            <Text style={styles.gptLabel}>AI Co-Pilot</Text>
            <View style={styles.gptMessage}>
                <View style={styles.typingIndicatorContainer}>
                    <View style={styles.typingDot}>
                        <ActivityIndicator size="small" color="#3b82f6"/>
                    </View>
                    <View style={styles.typingDot}>
                        <ActivityIndicator size="small" color="#3b82f6"/>
                    </View>
                    <View style={styles.typingDot}>
                        <ActivityIndicator size="small" color="#3b82f6"/>
                    </View>
                </View>
                <Text style={styles.messageTime}>
                    {format(new Date(), 'h:mm a')}
                </Text>
            </View>
        </View>
    )

    const handleEnterPress = async (nativeEvent: { key: string }) => {
        if (nativeEvent.key === 'Enter' && message !== '') {
            await handleSend()
            setMessage('')
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>AI Assistant</Text>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                style={styles.keyboardAvoidView}
                keyboardVerticalOffset={100}
            >
                {initialLoading ? (
                    <View style={styles.initialLoadingContainer}>
                        <ActivityIndicator size="large" color="#3b82f6"/>
                        <Text style={styles.loadingText}>Loading conversations...</Text>
                    </View>
                ) : (
                    <ScrollView
                        refreshControl={<RefreshControl refreshing={initialLoading} onRefresh={getMessages}/>}
                        ref={scrollViewRef}
                        contentContainerStyle={styles.scrollContainer}
                        showsVerticalScrollIndicator={false}
                    >
                        {conversation.length <= 0 ? (
                            <View style={styles.emptyStateContainer}>
                                <Icon name="chat" size={80} color="#CBD5E1"/>
                                <Text style={styles.greetingText}>Hey {firstName} 👋</Text>
                                <Text style={styles.subText}>How can I assist you today?</Text>
                            </View>
                        ) : (
                            sortedDates.map((date) => (
                                <View key={date} style={styles.dateGroup}>
                                    <View style={styles.dateHeaderContainer}>
                                        <Text style={styles.dateHeader}>{date}</Text>
                                    </View>

                                    {groupedMessages[date].map((msg: Conversation, idx: number) => {
                                        // Determine if this is the first message from this sender in this sequence
                                        const isPreviousSameSender = idx > 0 && groupedMessages[date][idx - 1].sender === msg.sender;
                                        // Add spacing between different senders' messages
                                        const isNewSenderGroup = idx > 0 && groupedMessages[date][idx - 1].sender !== msg.sender;

                                        return (
                                            <View key={idx}
                                                  style={isNewSenderGroup ? styles.newSenderGroup : undefined}>
                                                {/* Only show sender label when it's the first message from this sender in a sequence */}
                                                {(!isPreviousSameSender) && (
                                                    <Text
                                                        style={msg.sender === "user" ? styles.userLabel : styles.gptLabel}>
                                                        {msg.sender === "user" ? "You" : "AI Assistant"}
                                                    </Text>
                                                )}

                                                <View
                                                    style={msg.sender === "user" ? styles.userMessage : styles.gptMessage}>
                                                    <Text
                                                        style={msg.sender === "user" ? styles.userMessageText : styles.gptMessageText}>
                                                        {msg.message}
                                                    </Text>

                                                    <Text style={styles.messageTime}>
                                                        {format(new Date(msg.timestamp), 'h:mm a')}
                                                    </Text>
                                                </View>
                                            </View>
                                        );
                                    })}
                                </View>
                            ))
                        )}

                        {showTypingIndicator && <TypingIndicator/>}
                    </ScrollView>
                )}

                <View style={styles.inputContainer}>
                    <TextInput
                        placeholder="Type a message..."
                        value={message}
                        onChangeText={setMessage}
                        style={styles.input}
                        placeholderTextColor="#94a3b8"
                        multiline
                        maxLength={1000}
                        onKeyPress={({nativeEvent}) => handleEnterPress(nativeEvent)}
                        editable={!disabled}
                    />
                    <TouchableOpacity
                        style={[
                            styles.sendButton,
                            (message.trim() === '' || showTypingIndicator) && styles.sendButtonDisabled
                        ]}
                        onPress={handleSend}
                        disabled={disabled || message.trim() === '' || showTypingIndicator}
                    >
                        <Icon name="send" size={20} color="white"/>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
            <Toast topOffset={64}/>
        </SafeAreaView>
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