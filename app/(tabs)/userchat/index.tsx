// import {Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View,} from "react-native";
// import {useSelector} from "react-redux";
// import {RootState} from "../../../types/types";
// import {router} from "expo-router";
// import Icon from "react-native-vector-icons/MaterialIcons";
// import {format} from "date-fns";
// import React from "react";
//
// const Page = () => {
//     const userInfo = useSelector((state: RootState) => state.userInfo)
//     const name = userInfo.name
//     const image = require("../../../assets/images/campus-directory.png")
//
//     const splitFullName = name.split(" ")
//     const abbrevName =
//         splitFullName[0]?.charAt(0).toUpperCase() +
//         (splitFullName[1]?.charAt(0).toUpperCase() || "")
//
//     const demoChats = [
//         {
//             name: "Angel Curtis",
//             message: "Please help me find a good monitor for my home office",
//             timestamp: new Date().getTime(),
//         },
//         {
//             name: "Zaire Dorwart",
//             message: "How are you doing today?",
//             timestamp: new Date().getTime() - 120000,
//         },
//         {
//             name: "Kelas Malam",
//             message: "No one can come today?",
//             timestamp: new Date().getTime() - 2939393,
//         },
//     ];
//
//     return (
//         <SafeAreaView style={styles.container}>
//             <View style={styles.header}>
//                 <Text style={styles.nameText}>{name}</Text>
//                 <TouchableOpacity
//                     style={styles.iconButton}
//                     onPress={() => router.push({
//                         pathname: 'chat',
//                         params: {recipientEmail: 'example@gmail.com'}
//                     })}
//                     activeOpacity={0.8}>
//                     <Icon name="search" size={26} color="#4F46E5"/>
//                 </TouchableOpacity>
//             </View>
//             <Text style={styles.subHeading}>Chats</Text>
//             <ScrollView showsVerticalScrollIndicator={false}>
//                 {demoChats.map((chat, index) => (
//                     <TouchableOpacity
//                         key={index}
//                         style={styles.chatRow}
//                         activeOpacity={0.9}
//                         onPress={() => {
//                             router.push({
//                                 pathname: 'chat',
//                                 params: {recipientEmail: 'example@gmail.com'}
//                             })
//                         }}>
//                         <View style={styles.imageContainer}>
//                             {image ? (
//                                 <Image source={image} style={styles.profileImage}/>
//                             ) : (
//                                 <View style={styles.defaultImageView}>
//                                     <Text style={styles.abbrevText}>{abbrevName}</Text>
//                                 </View>
//                             )}
//                         </View>
//                         <View style={styles.chatContent}>
//                             <View style={styles.chatTextContainer}>
//                                 <Text style={styles.chatName}>{chat.name}</Text>
//                                 <Text
//                                     style={styles.chatMessage}
//                                     numberOfLines={1}
//                                     ellipsizeMode="tail">
//                                     {chat.message}
//                                 </Text>
//                             </View>
//                             <Text style={styles.chatTime}>
//                                 {format(chat.timestamp, "h:mm a")}
//                             </Text>
//                         </View>
//                     </TouchableOpacity>
//                 ))}
//             </ScrollView>
//         </SafeAreaView>
//     );
// };
//
// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         paddingHorizontal: 20,
//         paddingTop: 20,
//         backgroundColor: "#fff",
//     },
//     header: {
//         flexDirection: "row",
//         justifyContent: "space-between",
//         alignItems: "center",
//     },
//     nameText: {
//         fontSize: 22,
//         fontWeight: "600",
//         color: "#111827",
//         marginLeft: 26,
//     },
//     iconButton: {
//         backgroundColor: "#f1f1f1",
//         padding: 8,
//         borderRadius: 10,
//         marginRight: 24
//     },
//     subHeading: {
//         fontSize: 18,
//         fontWeight: "600",
//         color: "#4B5563",
//         marginBottom: 12,
//         marginLeft: 26,
//         marginTop: 12
//     },
//     chatRow: {
//         flexDirection: "row",
//         alignItems: "center",
//         paddingVertical: 12,
//         borderBottomColor: "#E5E7EB",
//         borderBottomWidth: 1,
//         marginHorizontal: 26,
//         marginTop: 4
//     },
//     imageContainer: {
//         marginRight: 12,
//     },
//     profileImage: {
//         height: 60,
//         width: 60,
//         borderRadius: 30,
//         borderWidth: 2,
//         borderColor: "#EEF2FF",
//     },
//     defaultImageView: {
//         height: 60,
//         width: 60,
//         borderRadius: 30,
//         backgroundColor: "#EEF2FF",
//         justifyContent: "center",
//         alignItems: "center",
//     },
//     abbrevText: {
//         fontSize: 22,
//         fontWeight: "700",
//         color: "#4F46E5",
//     },
//     chatContent: {
//         flex: 1,
//         flexDirection: "row",
//         justifyContent: "space-between",
//         alignItems: "center",
//     },
//     chatTextContainer: {
//         flex: 1,
//         marginRight: 10,
//     },
//     chatName: {
//         fontSize: 16,
//         fontWeight: "600",
//         color: "#1F2937",
//     },
//     chatMessage: {
//         fontSize: 14,
//         color: "#6B7280",
//         marginTop: 2,
//     },
//     chatTime: {
//         fontSize: 12,
//         color: "#9CA3AF",
//     },
// });
//
// export default Page
