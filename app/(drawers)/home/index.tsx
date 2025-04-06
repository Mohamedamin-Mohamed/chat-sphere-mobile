import {Button, StyleSheet, Text, View} from 'react-native';

export default function Page() {
    return (
        <View style={styles.container}>
            <Text style={styles.headline}>Welcome to ChatSphere – Your Campus Chat App!</Text>
            <Text style={styles.subheadline}>
                Connect with classmates, join study groups, and collaborate on projects – all in one place.
                ChatSphere is designed for students, by students.
            </Text>
            <Button title="Start Chatting Today – It’s Free!" onPress={() => {
            }}/>
            <View style={styles.features}>
                <Text style={styles.feature}>• Real-Time Messaging: Chat with classmates instantly.</Text>
                <Text style={styles.feature}>• Study Groups: Join or create groups for your courses.</Text>
                <Text style={styles.feature}>• File Sharing: Share notes, assignments, and more.</Text>
                <Text style={styles.feature}>• Privacy Controls: Control who can message you.</Text>
            </View>
            <Text style={styles.testimonial}>
                "ChatSphere made it so easy to organize study sessions with my classmates!" – Jane, University of XYZ
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
    },
    headline: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 10,
    },
    subheadline: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
    },
    features: {
        marginBottom: 20,
    },
    feature: {
        fontSize: 14,
        marginBottom: 5,
    },
    testimonial: {
        fontStyle: 'italic',
        textAlign: 'center',
    },
});