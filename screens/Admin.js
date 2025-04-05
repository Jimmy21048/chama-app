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
import { getDaysNumber, getRoundDetails, getUsers, updateUsers } from "../functions/functions";

const { width, height } = Dimensions.get('screen')
export default function Admin({ navigation, route }) {
    const { user, pwd } = route.params
    const { users, setUsers } = useUsers()
    const [data, setData] = useState({
        username: '',
        amount: 0
    })
    const[loading, setLoading] = useState(true)
    const[updateLoading, setUpdateLoading] = useState(false)
    const[message, setMessage] = useState({text: '', type: ''})
    const[selectedUser, setSelectedUser] = useState('select')
    const[rounds, setRounds] = useState({days: 30, amount: 150, date: '2025-01-01'})

    
    useEffect(() => {
        const fetchData = async () => {
            //fetch users and the details about the rounds
            let usersDetails = await getUsers()
            const roundDetails = await getRoundDetails()
            if(usersDetails.success) {
                if(roundDetails.success && roundDetails.success.length > 0) {
                    const roundDetailsHolder = roundDetails.success[0]
                    setRounds({days: roundDetailsHolder.round_days, date: roundDetailsHolder.start_date, amount: roundDetailsHolder.round_amount})

                    //get today's number since the start date of the rounds
                    let tempTodayNO = getDaysNumber(roundDetailsHolder.start_date).todayNumber
                    
                    const thisRound = Math.ceil(tempTodayNO / roundDetailsHolder.round_days)
                    //filter users whose week and month details are not upto date
                    const notUpdated = usersDetails.success.filter(user => {
                        return user.month < thisRound
                    }).map(user => {
                        return { username: user.username, month: user.month, monthDiff : thisRound - user.month, thisRound }
                    })

                    if(notUpdated.length > 0) {
                        //update week and month values for users with outdated values then retrieve the latest users list
                        await updateUsers(notUpdated, rounds.amount)
                        usersDetails = await getUsers()
                    }
                    setUsers(usersDetails.success)
                    setLoading(false)

                }else {
                    setMessage({ text: roundDetails.fail || "ERROR", type: 'error'})
                    setTimeout(() => {
                        setMessage({text: '', type: ''})
                    }, 5000)
                }
            } else {
                setMessage({ text: usersDetails.fail || "ERROR", type: 'error'})
                setTimeout(() => {
                    setMessage({text: '', type: ''})
                }, 5000)
            }

        }
        fetchData()
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
                                axios.get(`${HOST}/userExists/${data.user}`, setLoading(true))
                                .then(response => {
                                    const exists = response.data.exists

                                    if(exists) {
                                        setMessage({text: 'Member Already Exists', type: 'error'})
                                        setTimeout(() => {
                                            setMessage({text: '', type: ''})
                                        }, 5000)
                                    } else {
                                        const { todayNumber } = getDaysNumber(rounds.date)
                                        axios.post(`${HOST}/addUser`, {username: data.username, todayNumber, amount:  rounds.amount, days: rounds.days, userNumber: users.length})
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
        const { todayNumber } = getDaysNumber(rounds.date)
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
            axios.post(`${HOST}/updateAmount`, 
                {username: userItem.username, metaData: JSON.stringify(parsedMetaData), amount: data.amount, todayNumber, roundDays : rounds.days})
            .then(res => {
                if(res.data.success) {
                    setMessage({text: 'Amount Updated', type: 'success'})
                    setTimeout(() => {
                        setMessage({text: '', type: ''})
                    }, 5000)

                    setData({username: '', amount: 0})
                    setSelectedUser('select')
                    setUpdateLoading(false)
                } else {

                }

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

    if(loading) {
        return <Text>Loading</Text>
    }
    return (
        <ImageBackground
            source={require('../assets/bgc1.png')} style={styles.background}>
        <SafeAreaView style = { styles.container }>
            <StatusBar style="dark" />
            <ScrollView style = {{flexGrow: 1}}>
            {/* <View style={{flex: 1}}> */}
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
                        <Advanced {...{rounds, setRounds}} />
                    </View>
                </View>
            {/* </View> */}
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
        flex: 1,
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