import {StyleSheet, Text, TouchableOpacity, View} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import {useState} from "react";
import CampusConnectModal from "../../../modals/CampusConnectModal";

const CampusConnect = () => {
    const [campusConnectModal, setCampusConnectModal] = useState(false);
    const [isPressed, setIsPressed] = useState(false);

    const handleCampusConnectModal = () => {
        setCampusConnectModal(prev => !prev);
    };

    return (
        <View style={styles.container}>
            <View style={styles.childContainer}>
                <View style={styles.campusConnectView}>
                    <Icon name="school" size={20}/>
                    <Text style={styles.campusText}>Campus connect</Text>
                </View>
                <TouchableOpacity
                    style={[
                        campusConnectModal || isPressed ? styles.connectButtonPressed : styles.connectButton,
                    ]}
                    activeOpacity={0.9}
                    onPress={handleCampusConnectModal}
                    onPressIn={() => setIsPressed(true)}
                    onPressOut={() => setIsPressed(false)}
                >
                    <Text
                        style={[
                            styles.connectText,
                            (campusConnectModal || isPressed) && {color: 'white'},
                        ]}
                    >
                        Connect
                    </Text>
                </TouchableOpacity>
            </View>
            {campusConnectModal && (
                <CampusConnectModal
                    campusConnectModal={campusConnectModal}
                    handleCampusConnectModal={handleCampusConnectModal}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        width: '90%',
        padding: 16,
        borderRadius: 8,
    },
    childContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    campusConnectView: {
        flexDirection: 'row',
        gap: 30
    },
    campusText: {
        fontSize: 16
    },
    connectButtonPressed: {
        marginRight: 10,
        borderWidth: 1,
        borderColor: 'white',
        borderRadius: 4,
        paddingHorizontal: 12,
        paddingVertical: 6,
        backgroundColor: '#085bd8',
    },
    connectButton: {
        marginRight: 10,
        borderWidth: 1,
        borderRadius: 4,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderColor: '#085bd8'
    },
    connectText: {
        fontSize: 15,
        color: '#085bd8',
    }
})
export default CampusConnect