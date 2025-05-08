import React, {useEffect, useState} from 'react';
import {SafeAreaView, StyleSheet, TextInput, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import searchQuery from "../../../api/searchQuery";
import DisplayUsers from "./DisplayUsers";
import {SearchUser} from "../../../types/types";

const SearchBar = () => {
    const [searchText, setSearchText] = useState('')
    const [users, setUsers] = useState<SearchUser[]>([])
    const [loading, setLoading] = useState(false)
    const [pressed, setPressed] = useState(false)

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            if (searchText.trim().length === 0) {
                setUsers([])
                return
            }
            const searchUsers = async () => {
                setLoading(true)
                try {
                    const response = await searchQuery(searchText, new AbortController())
                    if (response.ok) {
                        const data = await response.json()
                        setUsers(data)
                    }
                } catch (exp: any) {
                    console.error('Something went wrong: ', exp)
                } finally {
                    setLoading(false)
                }
            }
            searchUsers().catch(err => console.error(err))
        }, 1000)
        return () => clearTimeout(delayDebounce)
    }, [searchText, pressed]);

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
                    <Icon name="search" size={20} color="#fff"/>
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
        backgroundColor: '#007AFF',
        padding: 10,
        borderRadius: 10,
        marginLeft: 8,
    },
});

export default SearchBar;
