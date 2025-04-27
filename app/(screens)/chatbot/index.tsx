import {SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View} from "react-native";
import {router} from "expo-router";
import Icon from "react-native-vector-icons/MaterialIcons";
import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {Conversation, RootState} from "../../../types/types";
import askChatGPT from "../../../api/askChatGPT";
import saveMessage from "../../../api/saveMessage";
import Toast from "react-native-toast-message";

const Index = () => {
    const [message, setMessage] = useState("");
    const userInfo = useSelector((state: RootState) => state.userInfo);
    const email = userInfo.email
    const firstName = userInfo.name.split(" ")[0];
    const [conversation, setConversation] = useState<Conversation[]>([])
    const [loading, setLoading] = useState(false)
    const [disabled, setDisabled] = useState(false)

    const handleSend = async () => {
        if (message === '') return;

        const date = new Date()
        // const formattedDate = format(date, 'MM/dd')
        //we append the newly asked message by the user
        const newConversation = [
            ...conversation, {sender: 'user', message: message, date: date}
        ]
        setConversation(newConversation)

        try {
            setLoading(true)
            //here we're getting gpt response
            const response = await askChatGPT(message);
            const data = await response.json()
            const gptMessage = data.choices[0].message.content
            //append gpt response to the current history of messages
            const updatedConversation = [
                ...newConversation, {sender: 'gpt', message: gptMessage, date: date}
            ]
            setConversation(updatedConversation)
            setMessage('')

            const [userResponse, gptResponse] = await Promise.all([
                saveMessage({sender: 'user', message: message, date: date, email: email}, new AbortController()),
                saveMessage({sender: 'gpt', message: gptMessage, date: date, email: email}, new AbortController())])

            if (!userResponse.ok || !gptResponse.ok) {
                Toast.show({
                    type: 'error',
                    text1: 'Error occurred',
                    text2: "Message couldn't be saved",
                    onShow: () => {
                        setDisabled(true)
                    },
                    onHide: () => {
                        setDisabled(false)
                    }
                })
            }

        } catch (exp: any) {
            console.error(exp)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        //here implement fetching of users message history
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    activeOpacity={0.8}
                    onPress={() => router.back()}
                    style={styles.backButton}
                >
                    <Icon name="arrow-back" size={28} color="white"/>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>AI Co-Pilot</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Text style={styles.greetingText}>Hey {firstName} 👋</Text>
                <Text style={styles.subText}>How can I assist you today?</Text>
                {loading && (
                    <Text style={styles.typingText}>AI is typing...</Text>
                )}
            </ScrollView>

            <View style={styles.inputContainer}>
                <TextInput
                    placeholder="Type a message..."
                    value={message}
                    onChangeText={setMessage}
                    style={styles.input}
                    placeholderTextColor="#94a3b8"
                />
                <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
                    <Icon name="send" size={22} color="white"/>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        paddingHorizontal: 16,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: 20,
        marginLeft: 20
    },
    backButton: {
        backgroundColor: "black",
        width: 40,
        height: 40,
        borderRadius: 24,
        justifyContent: "center",
        alignItems: "center",
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: "600",
        marginLeft: 12,
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    greetingText: {
        fontSize: 26,
        fontWeight: "700",
        color: "#0f172a",
    },
    subText: {
        fontSize: 18,
        color: "#475569",
        marginTop: 8,
    },
    typingText: {
        marginTop: 20,
        fontSize: 16,
        fontStyle: "italic",
        color: "#64748b",
        opacity: 0.7,
    },
    inputContainer: {
        flexDirection: "row",
        justifyContent: 'center',
        alignSelf: "center",
        marginBottom: 20,
        backgroundColor: "#f1f5f9",
        borderRadius: 25,
        paddingHorizontal: 16,
        paddingVertical: 8,
        width: '90%'
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: "black",
    },
    sendButton: {
        backgroundColor: "black",
        borderRadius: 20,
        padding: 10,
        marginLeft: 8,
    },
});

export default Index;
