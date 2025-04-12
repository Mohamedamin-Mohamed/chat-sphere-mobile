import {Button, Modal, StyleSheet, Text, View} from "react-native";
import AvatarModal from "./AvatarModal";

interface ProfileChangeModalProps {
    showDiscardModal: boolean
    cancelDiscard: ()=> void,
    confirmDiscard: ()=> void,
}
const ProfileChangeModal = ({showDiscardModal, cancelDiscard, confirmDiscard}: ProfileChangeModalProps) => {
    return (
        <Modal transparent={true} animationType="fade" visible={showDiscardModal}>
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <Text>Discard changes?</Text>
                    <Text style={styles.avatarText}>If you go back now you will lose your changes.</Text>
                    <View style={styles.buttonContainer}>
                        <Button title="Discard changes" onPress={cancelDiscard}/>
                    </View>
                    <View style={styles.buttonContainer}>
                        <Button title="Kepp editing" onPress={confirmDiscard}/>
                    </View>
                </View>
            </View>
        </Modal>
    )

}
const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "rgba(0, 0, 0, 0.5)"
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 10,

        width: '70%',
        borderColor: "white",
        borderRadius: 8,
        borderWidth: 0.4
    },
    buttonContainer: {
        borderTopWidth: 0.6,
        borderTopColor: '#ccc',
        width: '100%',
        marginTop: 10,

    },
    avatarText: {
        textAlign: 'center',
        fontSize: 18,
        fontWeight: "500",
        marginVertical: 10
    }
})
export default AvatarModal
