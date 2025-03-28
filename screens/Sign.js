import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { Dimensions, KeyboardAvoidingView, Platform, SafeAreaView, StyleSheet, TextInput, View, Text, TouchableOpacity, ImageBackground } from "react-native";
import * as SecureStore from 'expo-secure-store'
import axios from "axios";
import { HOST } from '@env'

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

    const handleSignup = () => {
        setData({
            username: data.username.trimEnd(),
            password: data.password.trimEnd()
        })
        if(data.username.length > 0 && data.password.length > 0) {

            axios.post(`http://${HOST}:3000/getUser`, {username: data.username})
            .then(res => {
                if(res.data.success) {
                    axios.post(`http://${HOST}:3000/verifyUser`, {username: data.username, password: data.password})
                    .then(res1  => {
                        if(res1.data.added) {
                            SecureStore.setItemAsync('user', JSON.stringify(data))
                            .then(() => {
                                setSuccess('SIGN UP SUCCESS')
                                setTimeout(() => {
                                    setSuccess(null)
                                }, 4000)
                                setAccExist(true)
                                navigation.navigate('account', { user: data.username, pwd: data.password })
                            })
                        } else {
                            setError('SORRY! OPERATION FAILED')
                            setTimeout(() => {
                                setError(null)
                            }, 4000)
                        }
                    })
                } else {
                    setError('INVALID CREDENTIALS')
                    setTimeout(() => {
                        setError(null)
                    }, 4000)
                }
            })

        } else {
            setError('EMPTY CREDENTIALS')
            setTimeout(() => {
                setError(null)
            }, 4000)
        }
        
    }

    const handleLogin = async () => {
        // await SecureStore.deleteItemAsync('user')
        setData({
            username: data.username.trimEnd(),
            password: data.password.trimEnd()
        })
        const cred = await SecureStore.getItemAsync('user')
        if(data.username === 'admin' && data.password === 'admin') {
            navigation.navigate('admin', { user: 'admin', pwd: 'admin' })
        }else if(cred === null) {
            setError("NO USER ACCOUNT DETECTED")
            setTimeout(() => {
                setError(null)
            }, 4000)
        }else {
            const parsedCred = JSON.parse(cred)

            if(parsedCred.username === data.username && parsedCred.password === data.password) {
                navigation.navigate('account', { user: data.username, pwd: data.password })
            } else {
                setError("INVALID CREDENTIALS")
                setTimeout(() => {
                    setError(null)
                }, 4000)
            }
        }

    }
    return (
        <ImageBackground 
            source={require('../assets/bgc1.png')} style={styles.background}>
        <KeyboardAvoidingView style = { styles.container }>
            <StatusBar style="dark" />
            <View style = { styles.header }>
                <Text style = { styles.title }>Chama</Text>
                {
                    signup && !accExist ? 
                    <TouchableOpacity style = {styles.option } onPress={() => setSignup(false)}>
                        <Text style = {{color: '#C04000', fontWeight: 800}}>Login</Text>
                    </TouchableOpacity> : (!signup && !accExist) &&
                    <TouchableOpacity  style = {styles.option } onPress={() => setSignup(true)}>
                        <Text style = {{color: '#C04000', fontWeight: 800}}>Signup</Text>
                    </TouchableOpacity>
                }
            </View>
            { error && <Text style = { styles.error }>{error}</Text> }
            { success && <Text style = { styles.success }>{success}</Text> }
                <View style = { styles.form }>
                    <View style = { styles.inputs }>
                        <View style = {{gap: 10}}>
                            { signup ? <Text style = {styles.label}>Username Given by Admin</Text> : <Text style = {styles.label}>Username</Text> }
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
        </ImageBackground>

    )
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
        alignItems: 'center',
        width: width,
        height: height
    },
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
        borderColor: '#C04000',
        borderWidth: 2,
        height: 30,
        width: 80,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
    },
    title : {
        fontSize: 40,
        fontWeight: 800,
        color: '#C04000',
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
        fontWeight: 700,
        color: 'black',
    },
    input : {
        height: 50,
        width: width * 0.9,
        borderRadius: 10,
        borderColor : '#B2BEB5',
        borderWidth: 2,
        fontSize: 18,
    },
    button : {
        alignSelf : 'center',
        width: 100,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        backgroundColor: '#2A3439',
    }
})