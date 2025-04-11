import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

export default function Page() {
    return (
        <View style={styles.container}>
            <Text style={styles.headline}>Welcome to ChatSphere – Your Campus Chat App!</Text>
            <Text style={styles.subheadline}>
                Connect with classmates, join study groups, and collaborate on projects – all in one place.
                ChatSphere is designed for students, by students.
            </Text>

            <Text style={styles.exploreHeader}>More to explore </Text>
            <View style={{gap: 10, alignSelf: 'center'}}>
                <TouchableOpacity>
                    <View style={styles.viewLikes}>
                        <Text style={styles.exploreSubHeader}>Create a group</Text>
                        <Text style={styles.exploreText}>Start your own chat and invite members</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity>
                    <View style={styles.viewLikes}>
                        <Text style={styles.exploreSubHeader}>Join groups</Text>
                        <Text style={styles.exploreText}>Discover trending and nearby groups</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity>
                    <View style={styles.viewLikes}>
                        <Text style={styles.exploreSubHeader}>Join your campus</Text>
                        <Text style={styles.exploreText}>Find groups, classmates, etc at your school</Text>
                    </View>
                </TouchableOpacity>
            </View>
            {/*<View style={styles.features}>*/}
            {/*    <Text style={styles.feature}>• Real-Time Messaging: Chat with classmates instantly.</Text>*/}
            {/*    <Text style={styles.feature}>• Study Groups: Join or create groups for your courses.</Text>*/}
            {/*    <Text style={styles.feature}>• File Sharing: Share notes, assignments, and more.</Text>*/}
            {/*    <Text style={styles.feature}>• Privacy Controls: Control who can message you.</Text>*/}
            {/*</View>*/}
            {/*<Text style={styles.testimonial}>*/}
            {/*    "ChatSphere made it so easy to organize study sessions with my classmates!" – Jane, University of XYZ*/}
            {/*</Text>*/}
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
    exploreHeader: {
        fontWeight: "600",
        fontSize: 20,
        textAlign: 'center',
        marginVertical: 20,
    },
    exploreSubHeader: {
        fontWeight: "500",
        fontSize: 16,
    },
    exploreText: {},
    viewLikes: {
        backgroundColor: "#e2e1e1",
        borderRadius: 8,
        justifyContent: 'center',
        width: "100%",
        padding: 10,
    }
});