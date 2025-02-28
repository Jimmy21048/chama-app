import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { Dimensions, KeyboardAvoidingView, Platform, SafeAreaView, StyleSheet, TextInput, View, Text, TouchableOpacity } from "react-native";
import * as SecureStore from 'expo-secure-store'

const { width, height } = Dimensions.get('screen')
export default function Sign({ navigation }) {
    const[signup, setSignup] = useState(false)
    const[data, setData] = useState({
        username: '',
        password: ''
    })
    const[error, setError] = useState(null)
    const[success, setSuccess] = useState(null)
    const[accExist, setAccExist] = useState(true)

    const checkAccount = async () => {
        const cred = await SecureStore.getItemAsync('user')
        cred === null && setAccExist(false)
    }
    checkAccount()

    const handleSignup = async () => {
        if(data.username.length > 0 && data.password.length > 0) {

            await SecureStore.setItemAsync('user', JSON.stringify(data))
            .then(() => {
                setSuccess('SIGN UP SUCCESS')
                setTimeout(() => {
                    setSuccess(null)
                }, 4000)
                setAccExist(true)
                navigation.navigate('account')
            })

        } else {
            setError('EMPTY CREDENTIALS')
            setTimeout(() => {
                setError(null)
            }, 4000)
        }
        
    }

    const handleLogin = async () => {
        const cred = await SecureStore.getItemAsync('user')
        if(cred === null) {
            setError("NO USER ACCOUNT DETECTED")
            setTimeout(() => {
                setError(null)
            }, 4000)
        }else if(data.username === 'admin' && data.password === 'admin') {
            navigation.navigate('admin', { user: 'Admin' })
        }else {
            const parsedCred = JSON.parse(cred)

            if(parsedCred.username === data.username && parsedCred.password === data.password) {
                navigation.navigate('account')
            } else {
                setError("INVALID CREDENTIALS")
                setTimeout(() => {
                    setError(null)
                }, 4000)
            }
        }

    }
    return (
        <KeyboardAvoidingView style = { styles.container }>
            <StatusBar style="dark" />
            <View style = { styles.header }>
                <Text style = { styles.title }>Chama</Text>
                {
                    signup && !accExist ? 
                    <TouchableOpacity style = {styles.option } onPress={() => setSignup(false)}>
                        <Text style = {{color: '#FF5800', fontWeight: 800}}>Login</Text>
                    </TouchableOpacity> : (!signup && !accExist) &&
                    <TouchableOpacity  style = {styles.option } onPress={() => setSignup(true)}>
                        <Text style = {{color: '#FF5800', fontWeight: 800}}>Signup</Text>
                    </TouchableOpacity>
                }
            </View>
            { error && <Text style = { styles.error }>{error}</Text> }
            { success && <Text style = { styles.success }>{success}</Text> }
                <View style = { styles.form }>
                    <View style = { styles.inputs }>
                        <View style = {{gap: 10}}>
                            <Text style = {styles.label}>Username</Text>
                            <TextInput value={data.username}  onChangeText={(val) => setData({...data, username: val})} style = { styles.input } />
                        </View>
                        <View style = {{gap: 10}}>
                            <Text style = {styles.label}>Password</Text>
                            <TextInput value={data.password} secureTextEntry onChangeText={(val) => setData({...data, password: val})} style = { styles.input } />
                        </View>
                        {
                            signup ?
                            <TouchableOpacity activeOpacity={0.4} style = { styles.button } onPress={handleSignup} >
                                <Text style = {{fontWeight: 800, color: 'white'}}>SIGNUP</Text>
                            </TouchableOpacity> :
                            <TouchableOpacity activeOpacity={0.4} style = { styles.button } onPress={handleLogin} >
                                <Text style = {{fontWeight: 800, color: 'white'}}>LOGIN</Text>
                            </TouchableOpacity>
                        }
                    </View>
                </View>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container : {
        flex: 1,
        paddingTop: Platform.OS === 'ios' ? 5 : 35,
    },
    header : {
        height: height * 0.1,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        justifyContent : 'space-between'
    },
    option : {
        borderColor: '#FF5800',
        borderWidth: 2,
        height: 30,
        width: 80,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
    },
    title : {
        fontSize: 30,
        fontWeight: 800
    },
    error : {
        fontSize: 17,
        fontWeight: 800,
        paddingLeft: 10,
        color: 'red'
    },
    success : {
        fontSize: 17,
        fontWeight: 800,
        paddingLeft: 10,
        color: 'green'
    },
    form : {
        flex: 1,
        justifyContent: 'flex-end'
    },
    inputs : {
        height: height * 0.35,
        padding: 10,
        gap: 30,
        marginBottom: 20
    },
    label : {
        fontSize : 18,
        fontWeight: 700
    },
    input : {
        height: 50,
        width: width * 0.9,
        borderRadius: 10,
        borderColor : 'black',
        borderWidth: 1,
        fontSize: 18
    },
    button : {
        alignSelf : 'center',
        width: 100,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        backgroundColor: '#3B3C36'
    }
})