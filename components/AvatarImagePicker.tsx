import {Image, StyleSheet, Text, View} from "react-native";
import {Dispatch, SetStateAction} from "react";
import Icon from "react-native-vector-icons/FontAwesome"

interface AvatarImagePickerProps {
    image: string | undefined
    setDisplayAvatarModal: Dispatch<SetStateAction<boolean>>,
    oauthProvider: string
}

const AvatarImagePicker: React.FC<AvatarImagePickerProps> = ({image, setDisplayAvatarModal, oauthProvider}) => {
    return (
        <View style={styles.imageView}>
            {image ? (
                <Image source={{uri: image}} style={styles.avatarImage}/>
            ) : (
                <Text style={styles.avatarText}>Add avatar</Text>
            )}
            {oauthProvider !== 'Google' &&
                <Icon
                    name="edit"
                    style={{position: 'absolute', left: '86%', top: '70%'}}
                    size={20}
                    color="blue"
                    onPress={() => setDisplayAvatarModal(prevState => !prevState)}
                />
            }
        </View>
    )
}

const styles = StyleSheet.create({
    imageView: {
        width: 100,
        height: 100,
        borderRadius: 48,
        backgroundColor: '#e5e8e8',
        alignItems: 'center',
        justifyContent: 'center'
    },
    message: {
        textAlign: 'center',
        paddingBottom: 10,
    },
    avatarText: {
        color: '#899292',
        fontSize: 14
    },
    avatarImage: {
        resizeMode: "cover",
        width: 100,
        height: 100,
        borderRadius: 48,
    },
})

export default AvatarImagePicker