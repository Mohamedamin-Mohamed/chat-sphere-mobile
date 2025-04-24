import React from "react";
import {StyleSheet, View} from "react-native";
import PinVerificationUI from "./PinVerificationUI"

const PinVerificationScreen = () => {
    return (
        <View style={styles.container}>
            <View style={styles.innerWrapper}>
                <PinVerificationUI/>
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

export default PinVerificationScreen;
