import {Button, Modal, StyleSheet, Text, View} from "react-native"

interface AvatarModalProps {
    handleModalDisplay: () => void,
    choosePhoto: () => void
}

const AvatarModal = ({handleModalDisplay, choosePhoto}: AvatarModalProps) => {
    const handlePhotoSelection = () => {
        handleModalDisplay()
        choosePhoto()
    }

    return (
        <Modal transparent={true} animationType="fade">
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <Text style={styles.avatarText}>Set Avatar</Text>
                    <View style={styles.buttonContainer}>
                        <Button title="Take photo"/>
                    </View>
                    <View style={styles.buttonContainer}>
                        <Button title="Choose photo" onPress={handlePhotoSelection}/>
                    </View>
                    <View style={styles.buttonContainer}>
                        <Button title="Cancel" onPress={handleModalDisplay}/>
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