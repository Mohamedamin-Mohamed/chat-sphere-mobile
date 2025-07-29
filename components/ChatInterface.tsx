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
    View
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import {Conversation, RootState} from "../types/types";
import {format} from "date-fns";
import {Ionicons} from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import React, {Dispatch, RefObject, SetStateAction, useState} from "react";
import {useSelector} from "react-redux";

interface ChatInterfaceProps {
    initialLoading: boolean,
    disabled: boolean,
    showTypingIndicator: boolean
    handleSend: () => void,
    message: string,
    setMessage: Dispatch<SetStateAction<string>>,
    getMessages: () => void,
    scrollViewRef: RefObject<ScrollView>,
    conversation: Conversation[],
    sortedDates: string[],
    groupedMessages: Record<string, Conversation[]>,
}

const ChatInterface = ({
                           initialLoading, disabled, showTypingIndicator, handleSend, message,
                           setMessage, getMessages, scrollViewRef, conversation, sortedDates,
                           groupedMessages
                       }: ChatInterfaceProps) => {
    const userInfo = useSelector((state: RootState) => state.userInfo)
    const firstName = userInfo.name.split(" ")[0];
    const [showScrollToBottom, setShowScrollToBottom] = useState(false);

    const TypingIndicator = () => (
        <View>
            <Text style={styles.gptLabel}>AI Assistant</Text>
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
                keyboardVerticalOffset={50}
            >
                {initialLoading ? (
                    <View style={styles.initialLoadingContainer}>
                        <ActivityIndicator size="large" color="#3b82f6"/>
                        <Text style={styles.loadingText}>Loading conversations...</Text>
                    </View>
                ) : (
                    <ScrollView
                        onScroll={(event) => {
                            const {contentOffset, layoutMeasurement, contentSize} = event.nativeEvent
                            const isAtBottom = contentOffset.y + layoutMeasurement.height >= contentSize.height - 50
                            setShowScrollToBottom(!isAtBottom)
                        }}
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
                {showScrollToBottom && (
                    <View style={styles.arrowDownView}>
                        <TouchableOpacity style={styles.arrowDownViewButton}
                                          onPress={() => scrollViewRef.current?.scrollToEnd({animated: true})}>
                            <Ionicons name="arrow-down-circle" size={50} color="gray"/>

                        </TouchableOpacity>
                    </View>
                )}
                <View style={styles.inputContainer}>
                    <TextInput
                        placeholder="Type a message..."
                        value={message}
                        onChangeText={setMessage}
                        style={styles.input}
                        placeholderTextColor="#94a3b8"
                        autoCapitalize='none'
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
    )
}

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

export default ChatInterface