import React, {useCallback, useState} from 'react';
import {SafeAreaView, StyleSheet, TextInput, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import searchQuery from "../../../api/searchQuery";
import DisplayUsers from "./DisplayUsers";
import {RootState, SearchUser} from "../../../types/types";
import {useSelector} from "react-redux";
import {useFocusEffect} from "expo-router";

const SearchBar = () => {
    const userInfo = useSelector((state: RootState) => state.userInfo)
    const email = userInfo.email

    const [searchText, setSearchText] = useState('')
    const [users, setUsers] = useState<SearchUser[]>([])
    const [loading, setLoading] = useState(false)
    const [pressed, setPressed] = useState(false)

    useFocusEffect(
        useCallback(() => {
            if (searchText.trim().length > 0) {
                const searchUsers = async () => {
                    setLoading(true)
                    try {
                        const response = await searchQuery(email, searchText, new AbortController())
                        if (response.ok) {
                            const data = await response.json()
                            setUsers(data)
                        }
                    } catch (exp) {
                        console.error('Something went wrong: ', exp)
                    } finally {
                        setLoading(false)
                    }
                };
                searchUsers().catch(err => console.error(err));
            }
        }, [searchText, pressed])
    )


    return (
        <SafeAreaView style={{flex: 1, alignSelf: 'center', top: 100}}>
            <View style={styles.container}>
                <TextInput
                    placeholder="Search users..."
                    placeholderTextColor="#999"
                    autoCapitalize='none'
                    value={searchText}
                    onChangeText={setSearchText}
                    style={styles.input}
                />
                <TouchableOpacity style={styles.button} onPress={() => setPressed(true)}>
                    <Icon name="search" size={20} color="white"/>
                </TouchableOpacity>
            </View>
            <DisplayUsers users={users} loading={loading}/>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: '#f0f0f0',
        borderRadius: 12,
        paddingHorizontal: 10,
        paddingVertical: 8,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
        width: '90%'
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#333',
        paddingVertical: 6,
        paddingHorizontal: 10,
    },
    button: {
        backgroundColor: '#4F46E5',
        padding: 10,
        borderRadius: 10,
        marginLeft: 8,
    },
});

export default SearchBar;
