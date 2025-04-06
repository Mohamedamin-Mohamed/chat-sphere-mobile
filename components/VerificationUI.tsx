import Icon from "react-native-vector-icons/MaterialIcons";

const RenderVerificationUI = ()=> {
    return(
        <>
            <Icon name="close" size={26} style={styles.closeIcon} onPress={onCancel} />
            <Image source={OTP_IMAGE} style={styles.image} />
            <Text style={styles.headerText}>Verify</Text>
            <Text style={styles.subHeaderText}>Your code was sent you via email</Text>

            <View style={styles.codeInputContainer}>
                {Array(6).fill('').map((_, index) => (
                    <TextInput
                        key={index}
                        keyboardType="number-pad"
                        maxLength={1}
                        style={[
                            styles.verificationInput,
                            verificationCode[index] && styles.filledInput
                        ]}
                        value={verificationCode[index]?.toString()}
                        onChangeText={val => handleChange(val, index)}
                        onKeyPress={({nativeEvent}) => handleBackspace(index, nativeEvent)}
                        ref={el => inputRefs.current[index] = el}
                    />
                ))}
            </View>

            {verificationError && <Text style={styles.errorText}>{verificationError}</Text>}

            <TouchableOpacity
                disabled={disabled}
                style={styles.verifyButton}
                activeOpacity={0.8}
                onPress={handleCodeVerification}
            >
                {loading ?
                    <ActivityIndicator size="small" color="white" /> :
                    <Text style={styles.verifyText}>Verify</Text>
                }
            </TouchableOpacity>

            <View style={styles.footer}>
                <Text style={styles.footerText}>Don't receive code?</Text>
                <TouchableOpacity onPress={handleOtpRegeneration} activeOpacity={0.8}>
                    <Text style={[styles.footerText, styles.linkText]}>Request again</Text>
                </TouchableOpacity>
            </View>
        </>
    )
}