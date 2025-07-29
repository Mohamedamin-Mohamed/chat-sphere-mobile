import React, {useCallback, useRef, useState} from 'react';
import {SafeAreaView, StyleSheet, TextInput, TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import DisplayUsers from "./DisplayUsers";
import {RootState, SearchUser} from "../../../types/types";
import {useSelector} from "react-redux";
import {useFocusEffect} from "expo-router";
import api from "../../../api/api";

const SearchBar = () => {
    const userInfo = useSelector((state: RootState) => state.userInfo)
    const requesterEmail = userInfo.email

    const [query, setQuery] = useState('')
    const [users, setUsers] = useState<SearchUser[]>([])
    const [loading, setLoading] = useState(false)
    const [pressed, setPressed] = useState(false)
    const debounceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useFocusEffect(
        useCallback(() => {
            onRefresh()
            return () => {
                if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current)
            }
        }, [query, pressed])
    )

    const onRefresh = () => {
        if (query.trim().length < 0) return

        if (debounceTimeoutRef.current) clearTimeout(debounceTimeoutRef.current)
        debounceTimeoutRef.current = setTimeout(() => {
            setLoading(true)
            const searchUsers = async () => {
                try {
                    const response = await api.get(`api/users/search`, {
                        params: {requesterEmail, query}
                    })
                    const data = await response.data
                    setUsers(data)
                } catch (exp) {
                    //maybe implement checking if the exception is an axios one and then having a toast message for that
                    console.error('Something went wrong: ', exp)
                } finally {
                    setLoading(false)
                }
            };
            searchUsers().catch(err => console.error(err));
        }, 5000)
    }

    return (
        <SafeAreaView style={{flex: 1, alignSelf: 'center', top: 100}}>
            <View style={styles.container}>
                <TextInput
                    placeholder="Search users..."
                    placeholderTextColor="#999"
                    autoCapitalize='none'
                    value={query}
                    onChangeText={setQuery}
                    style={styles.input}
                />
                <TouchableOpacity style={styles.button} onPress={() => setPressed(true)}>
                    <Icon name="search" size={20} color="white"/>
                </TouchableOpacity>
            </View>
            <DisplayUsers users={users} loading={loading} onRefresh={onRefresh}/>
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
