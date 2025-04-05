import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Dimensions, KeyboardAvoidingView, Platform, SafeAreaView, StyleSheet, TextInput, View, Text, TouchableOpacity, ImageBackground } from "react-native";
import * as SecureStore from 'expo-secure-store'
import Message from "../components/Message";
import { getUser, verifyUser } from "../functions/functions";

const { width, height } = Dimensions.get('screen')
export default function Sign({ navigation }) {
    const[signup, setSignup] = useState(false)
    const[data, setData] = useState({
        username: '',
        password: ''
    })
    const[accExist, setAccExist] = useState(true)
    const[message, setMessage] = useState({text: '', type: ''})

    useEffect(() => {
        const checkAccount = async () => {
            const cred = await SecureStore.getItemAsync('user')
            cred === null && setAccExist(false)
        }
        checkAccount()
    }, [])

    const handleSignup = async () => {
        setData({
            ...data,
            username: data.username.trimEnd(),
        })
        if(data.username.trimEnd().length > 0 && data.password.length > 0) {
            const userDetails = await getUser(data.username.trimEnd())
            if(userDetails.success) {
                console.log("part 1")
                const userVerification = await verifyUser(data.username.trimEnd(), data.password)
                console.log(userVerification)
                if(userVerification.success) {
                    console.log("part 2")
                    await SecureStore.setItemAsync('user', JSON.stringify(data))

                    setMessage({text: 'SIGN UP SUCCESS', type: 'success'})
                    setTimeout(() => {
                        setMessage({text: '', type: ''})
                    }, 4000)

                    setAccExist(true)
                    navigation.navigate('account', { user: data.username.trimEnd(), pwd: data.password })
                } else {
                    setMessage({text: userVerification.fail || 'ERROR', type: 'error'})
                    setTimeout(() => {
                        setMessage({text: '', type: ''})
                    }, 4000)
                }
            } else {
                setMessage({text: userDetails.fail || 'ERROR', type: 'error'})
                setTimeout(() => {
                    setMessage({text: '', type: ''})
                }, 4000)
            }
        }
        
    }

    const handleLogin = async () => {
        // await SecureStore.deleteItemAsync('user')

        //cred for credentials
        const cred = await SecureStore.getItemAsync('user')
        if(data.username.trimEnd() === 'admin' && data.password === 'admin') {
            navigation.navigate('admin', { user: 'admin', pwd: 'admin' })
        }else if(cred === null) {
            setMessage({text: 'NO USER ACCOUNT DETECTED', type: 'error'})
            setTimeout(() => {
                setMessage({text: '', type: ''})
            }, 4000)
        }else {
            const parsedCred = JSON.parse(cred)

            if(parsedCred.username === data.username.trimEnd() && parsedCred.password === data.password) {
                navigation.navigate('account', { user: data.username, pwd: data.password })
            } else {
                setMessage({text: 'INVALID CREDENTIALS', type: 'error'})
                setTimeout(() => {
                    setMessage({text: '', type: ''})
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
            {
                message.text !== '' && <Message message={message.text} type={message.type} />
            }
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