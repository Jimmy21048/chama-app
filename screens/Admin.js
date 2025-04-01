import { Platform, SafeAreaView, StyleSheet, Dimensions, Text, View, TouchableOpacity, TextInput, Alert, ImageBackground, ScrollView } from "react-native";
import { StatusBar } from "expo-status-bar";
import { MaterialIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import axios from "axios";
import { Picker } from '@react-native-picker/picker';
import { HOST } from '@env'
import Rounds from "../components/Rounds";
import Message from "../components/Message";
import { useUsers } from "../helpers/UsersContext";
import Advanced from "../components/AdvancedRoundSettings";

const { width, height } = Dimensions.get('screen')
export default function Admin({ navigation, route }) {
    const { user, pwd } = route.params
    const { users, setUsers } = useUsers()
    const [data, setData] = useState({
        username: '',
        amount: 0
    })
    const[loading, setLoading] = useState(false)
    const[updateLoading, setUpdateLoading] = useState(false)
    const[message, setMessage] = useState({text: '', type: ''})
    const[displayMessage, setDisplayMessage] = useState(false)
    // const[users, setUsers] = useState([])
    const[selectedUser, setSelectedUser] = useState('select')

    useEffect(() => {
        axios.get(`http://${HOST}:3000/getUsers`)
        .then(response => {
            if(response.data.success) {
                setUsers(response.data.success)
            }
        }).catch(err => {
            console.log(err)
        })
    }, [loading, updateLoading])

    const handleAddMember = () => {
                Alert.alert(
                    'Add Member',
                    "Confirm Action to Add Member",
                    [
                        {
                            text: "Cancel",
                            style: "cancel"
                        },
                        {
                            text: "Add",
                            onPress: () => {
                                axios.post(`http://${HOST}:3000/userExists`, {username: data.username}, setLoading(true))
                                .then(response => {
                                    const exists = response.data.exists

                                    if(exists) {
                                        setMessage({text: 'Member Already Exists', type: 'error'})
                                        setTimeout(() => {
                                            setMessage({text: '', type: ''})
                                        }, 5000)
                                    } else {
                                        axios.post(`http://${HOST}:3000/addUser`, {username: data.username})
                                        .then(res => {
                                            if(res.data.added) {
                                                setData({username: '', amount: 0})
                                                setMessage({text: 'Member Added Successfully', type: 'success'})
                                                setTimeout(() => {
                                                    setMessage({text: '', type: ''})
                                                }, 5000) 
                                            }
                                        })
                                    }
                                    setLoading(false)
                                }).catch(err => {
                                    setMessage({text: 'Error Adding Member', type: 'error'})
                                    setTimeout(() => {
                                        setMessage('')
                                    }, 5000)
                                })
                            }
                        }
                    ]
                )
    }

    const handleUpdateAmount = () => {
        setUpdateLoading(true)
        const date = new Date().toLocaleDateString()
        
        const metaData = {
            date: date,
            amount: data.amount
        }

        const userItem = users.filter((user) => {
            return user.username === selectedUser
        })[0]

        
        if(data.amount > 0 && userItem) {
            const parsedMetaData = JSON.parse(userItem.metaData) 
            parsedMetaData.push(metaData)
            axios.post(`http://${HOST}:3000/updateAmount`, 
                {username: userItem.username, metaData: JSON.stringify(parsedMetaData), amount: data.amount})
            .then(res => {
                setMessage({text: 'Amount Updated', type: 'success'})
                setTimeout(() => {
                    setMessage({text: '', type: ''})
                }, 5000)

                setData({username: '', amount: 0})
                setSelectedUser('select')
                setUpdateLoading(false)
            })
        } else {
            setMessage({text: 'Please Select a valid Member or Amount', type: 'error'})
            setTimeout(() => {
                setMessage({text: '', type: ''})
            }, 5000)
            setData({username: '', amount: 0})
            setUpdateLoading(false)
            
        }
    }

    return (
        <ImageBackground
            source={require('../assets/bgc1.png')} style={styles.background}>
        <SafeAreaView style = { styles.container }>
            <StatusBar style="dark" />
            <ScrollView style = {{flexGrow: 1}}>
                <View style = { styles.header }>
                    <Text style = {{ 
                        fontSize: 30, borderColor: '#000000', 
                        borderWidth: 4, width: 50, height: 50, 
                        textAlign: 'center', borderRadius: 50 }}
                    >{user.at(0)}</Text>
                    <TouchableOpacity activeOpacity={0.6} onPress={() => navigation.navigate('modal', { user: user, pwd: pwd })} >
                        <MaterialIcons name="settings" color={'black'} size={40} />
                    </TouchableOpacity>
                </View>
                {
                    message.text.length > 0 && <Message message={message.text} type={message.type} />
                }
                <View style = { styles.body }>
                    <View style = {styles.addMember}>
                        <Text style = {{ fontSize: 18 }}>Add Member</Text>
                        <TextInput style = { styles.input } placeholder="username..." value={data.username} onChangeText={(text) => setData({...data, username: text})} />
                        <TouchableOpacity disabled = {loading ? true : false} onPress={handleAddMember} activeOpacity={0.2} style = { styles.btnChange }>
                            { loading ? <Text  style={{color: 'white'}}>Checking...</Text>: <Text style={{color: 'white'}}>Add Member</Text> }
                        </TouchableOpacity>
                    </View>

                    <View style = { styles.addMember } >
                        <Text style = {{ fontSize: 18 }}>Update weekly Payment</Text>
                        <Picker
                        style = { styles.pickers }
                        selectedValue={selectedUser}
                        onValueChange={(val) => setSelectedUser(val)} >
                        <Picker.Item key={'admin'} label="Select Member" value="" />
                        {
                            users.map(user => {
                                return <Picker.Item key={user.id} label={user.username} value={user.username} />
                            })
                        }
                        </Picker>
                        <TextInput style = { styles.input } placeholder="Amount..." value={data.amount} onChangeText={(text) => setData({...data, amount: text})} />
                        <TouchableOpacity disabled = {loading ? true : false} onPress={handleUpdateAmount} activeOpacity={0.2} style = { styles.btnChange }>
                            { updateLoading ? <Text style={{color: 'white'}}>Checking...</Text>: <Text style={{color: 'white'}}>Update Amount</Text> }
                        </TouchableOpacity>
                    </View>
                    <View style={styles.addMember}>
                        <Text style = {{ fontSize: 18 }}>Rounds</Text>
                        <Rounds {...{navigation, users, user, pwd}} />
                    </View>
                    <View style = {styles.addMember}>
                        <Text style = {{ fontSize: 18 }}>Advanced Round Settings</Text>
                        <Advanced />
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
        </ImageBackground>

    )
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
        width: width,
        height: height
    },
    container: {
        paddingTop: Platform.OS === 'android' ? 30 : 5,
        flex: 1
    },
    header: {
        height: height * 0.09,
        paddingHorizontal: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    body: {
        borderWidth: 1,
        borderTopColor: 'black',
        height: height * 0.9,
        padding: 10,
        gap: 10
    },
    addMember: {
        borderWidth: 2,
        borderColor: '#B2BEB5',
        padding: 10,
        gap: 10,
        borderRadius: 5,
    },
    btnChange: {
        width: 150,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
        backgroundColor: '#2A3439',
    },
    input: {
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 10,
        width: 150
    },
    pickers: {
        backgroundColor: '#C0C0C0',
        width: 200
    }
})