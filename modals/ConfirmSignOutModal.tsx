import {Modal, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

interface ConfirmModalProps {
    visible: boolean;
    onCancel: () => void;
    onConfirm: () => void;
}

const ConfirmSignOutModal: React.FC<ConfirmModalProps> = ({visible, onCancel, onConfirm}) => {
    return (
        <Modal transparent visible={visible} animationType="fade" onRequestClose={onCancel}>
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <Text style={styles.message}>Are you sure you want to sign out?</Text>
                    <View style={styles.actions}>
                        <TouchableOpacity style={[styles.button, styles.cancel]} onPress={onCancel} activeOpacity={0.8}>
                            <Text style={styles.cancelText}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.button, styles.confirm]} onPress={onConfirm}
                                          activeOpacity={0.8}>
                            <Text style={styles.confirmText}>Yes</Text>
                        </TouchableOpacity>
                    </View>

                </View>
            </View>
        </Modal>
    );
};

export default ConfirmSignOutModal;

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        width: 300,
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        alignItems: 'center',
    },
    message: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
        width: '100%',
    },
    button: {
        flex: 1,
        paddingVertical: 10,
        borderRadius: 8,
        alignItems: 'center'
    },
    cancel: {
        backgroundColor: '#e0e0e0',
    },
    confirm: {
        backgroundColor: '#ff4d4f',
    },
    cancelText: {
        color: '#333',
        fontWeight: '500',
    },
    confirmText: {
        color: '#fff',
        fontWeight: '500',
    },
});
