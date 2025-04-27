import React from "react";
import {View, StyleSheet} from "react-native";
import PasswordResetUI from "./PasswordResetUI"; // update the path if needed

interface PasswordResetScreenProps {
    loading: boolean;
    disabled: boolean
    passwordError: string;
    handlePasswordChange: (key: string, val: string) => void;
    handleResetPassword: () => Promise<void>;
    onCancel: () => void,
}

const PasswordResetScreen = ({
                                 loading,
                                 disabled,
                                 passwordError,
                                 handlePasswordChange,
                                 handleResetPassword,
                                 onCancel
                             }: PasswordResetScreenProps) => {
    return (
        <View style={styles.container}>
            <View style={styles.innerWrapper}>
                <PasswordResetUI
                    loading={loading}
                    disabled={disabled}
                    passwordError={passwordError}
                    handlePasswordChange={handlePasswordChange}
                    handleResetPassword={handleResetPassword}
                    onCancel={onCancel}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 30,
        flex: 1,
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 20,
    },
    innerWrapper: {
        backgroundColor: 'white',
        marginTop: 120,
        width: '96%',
        maxWidth: 400,
        padding: 20,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
});



export default PasswordResetScreen;
