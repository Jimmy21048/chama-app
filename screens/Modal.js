
import { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from "react-native";
import * as SecureStore from 'expo-secure-store'

export default function Modal({ navigation, route }) {
    const { user, pwd } = route.params

    const[message, setMessage] = useState('')
    const [data, setData] = useState({
        username: user,
        password: pwd
    })

    const handleDeleteAccount = () => {
        Alert.alert(
            'Confirm Account Deletion',
            "Are you sure you want to delete your account?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Delete",
                    onPress: async () => {
                        await SecureStore.deleteItemAsync('user').then(() => {
                            navigation.replace('sign')
                        })
                    }
                }
            ]
        )
        
        
    }

    const handleUpdateProfile = async () => {

        await SecureStore.setItemAsync('user', JSON.stringify(data))
        .then(() => {
            setMessage("PROFILE UPDATED SUCCESSFULLY")
            setTimeout(() => {
                setMessage('')
            }, 4000)
        })
    }

    const handleLogout = () => {
        navigation.replace('sign')
    }
    return (
        <View style = { styles.container }>
            <View style = {{ gap: 10, paddingVertical: 20 }}>
                <Text style = {{ fontWeight: 800, fontSize: 30 }}>Profile</Text>
                <View style = {{ gap: 10, borderBottomColor: '#808080', borderBottomWidth: 1}}>
                    <Text>Username</Text>
                    <TextInput defaultValue={user} onChangeText={(text) => setData({...data, username: text})} style = { styles.input } />

                    <Text>Password</Text>
                    <TextInput defaultValue={pwd} onChangeText={(text) => setData({...data, password: text})} secureTextEntry style = { styles.input } />

                    <TouchableOpacity activeOpacity={0.6} style = {styles.btnChange} onPress={handleUpdateProfile}>
                        <Text style = {{ fontWeight: 700 }}>Update Profile</Text>
                    </TouchableOpacity>

                    <Text style = {{color: '#A52A2A'}}>{ message }</Text>
                </View>
                <Text style = {{ fontWeight: 800, fontSize: 30 }}>Account</Text>
                <View style = {{ gap: 50 }}>
                    <TouchableOpacity  style = {styles.option } onPress={handleLogout}>
                        <Text style = {{color: '#A52A2A', fontWeight: 800}}>Log out</Text>
                    </TouchableOpacity>
                    <TouchableOpacity  style = {styles.option2 } onPress={handleDeleteAccount}>
                        <Text style = {{ fontWeight: 800}}>Delete</Text>
                    </TouchableOpacity>
                </View>

            </View>
            

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: '#ff0000',
        padding: 20
    },
    btnChange: {
        width: 120,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        backgroundColor: '#00B9E8'
    },
    input: {
        borderWidth: 1,
        borderColor: '#808080',
        width: 250,
        marginBottom: 20,
        borderRadius: 5
    },
    option : {
        borderColor: '#A52A2A',
        borderWidth: 1,
        width: 120,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
    },
    option2: {
        width: 120,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        backgroundColor: '#ED1B24'
    }
})