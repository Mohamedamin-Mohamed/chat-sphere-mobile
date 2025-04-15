import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";

interface EmailNotValidModalProps {
    showModal: boolean;
    discardModal: () => void;
}

const EmailNotValidModal = ({ showModal, discardModal }: EmailNotValidModalProps) => {
    return (
        <Modal transparent={true} animationType="fade" visible={showModal}>
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <TouchableOpacity style={styles.closeButton} onPress={discardModal}>
                        <Icon name='close' size={20} color='#fff'/>
                    </TouchableOpacity>
                    <Icon name='error-outline' size={50} color="#e53935" style={styles.icon}/>
                    <Text style={styles.title}>Invalid Email</Text>
                    <Text style={styles.message}>This doesn’t look like a valid email address. Please double-check and
                        try again.</Text>
                    <TouchableOpacity style={styles.tryAgainButton} onPress={discardModal}>
                        <Text style={styles.tryAgainText}>Try Again</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 25,
        width: '80%',
        borderRadius: 12,
        alignItems: 'center',
        position: 'relative',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5,
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: 'transparent',
        padding: 10,
        borderRadius: 15,
    },
    icon: {
        marginBottom: 10,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    message: {
        fontSize: 15,
        color: '#555',
        textAlign: 'center',
        marginBottom: 20,
        lineHeight: 22,
    },
    tryAgainButton: {
        backgroundColor: '#085bd8',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    tryAgainText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default EmailNotValidModal;
