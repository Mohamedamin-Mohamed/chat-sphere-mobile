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
        flex: 1,
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 20
    },
    innerWrapper: {
        width: "100%",
        maxWidth: 400,
    },
});

export default PasswordResetScreen;
