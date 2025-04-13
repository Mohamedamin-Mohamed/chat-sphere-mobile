import {Modal, StyleSheet, Text, TouchableOpacity, View} from "react-native";

interface ProfileChangeModalProps {
    showDiscardModal: boolean;
    cancelDiscard: () => void;
    confirmDiscard: () => void;
}

const DiscardModal = ({showDiscardModal, cancelDiscard, confirmDiscard}: ProfileChangeModalProps) => {
    return (
        <Modal transparent={true} animationType="fade" visible={showDiscardModal}>
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <View style={styles.headerView}>
                        <Text style={styles.discardText}>Discard changes?</Text>
                        <Text style={styles.avatarText}>If you go back now you will lose your changes.</Text>
                    </View>

                    <TouchableOpacity style={styles.buttonContainer} onPress={confirmDiscard} activeOpacity={0.3}>
                        <Text style={styles.discardButtonText}>Discard changes</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.buttonContainer} onPress={cancelDiscard} activeOpacity={0.3}>
                        <Text style={styles.keepEditingText}>Keep editing</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
        backgroundColor: '#f5f5f5',
        padding: 20,
        width: '70%',
        borderRadius: 8,
        borderWidth: 0.4,
    },
    headerView: {
        marginBottom: 10,
    },
    discardText: {
        fontSize: 18,
        fontWeight: '500',
        textAlign: 'center',
    },
    avatarText: {
        textAlign: 'center',
        fontSize: 13,
        color: '#6b6868',
        fontWeight: "500",
        marginVertical: 10,
    },
    buttonContainer: {
        borderTopWidth: 0.6,
        borderTopColor: '#ccc',
        width: '100%',
        paddingVertical: 14,
        alignItems: 'center',
    },
    discardButtonText: {
        color: '#f22c3d',
        fontSize: 16,
        fontWeight: '600',
    },
    keepEditingText: {
        color: '#255BE2ED',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default DiscardModal;
