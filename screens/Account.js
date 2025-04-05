import { View, Text, StyleSheet, SafeAreaView, Platform, TouchableOpacity, Dimensions, ImageBackground } from "react-native";
import * as Progress from 'react-native-progress';
import { MaterialIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import axios from "axios";
import { HOST } from '@env'
import { getRoundPerson, daysToMyRound, getDaysNumber, getUsers, getRoundDetails } from '../functions/functions'
import Message from "../components/Message";


const { height, width } = Dimensions.get('screen')
export default function Home({ navigation, route }) {
    const { user, pwd } = route.params
    const[users, setUsers] = useState([])
    const[myData, setMyData] = useState({
        weekly: 1,
        metaData: []
    })
    const[totalAmount, setTotalAmount] = useState(0)
    const[monthlyTotal, setMonthlyTotal] = useState(0)
    const[savings, setSavings] = useState(0)
    const[rounds, setRounds] = useState({days: 0, date: '2025-02-01'})
    const[loading, setLoading] = useState(true)
    const[message, setMessage] = useState({text: '', type: ''})
    const[roundNumber, setRoundNumber] = useState(0)
    const[roundUser, setRoundUser] = useState({})
    const[myDay, setMyDay] = useState(0)

    useEffect(() => {
        const fetchData = async () => {
            const usersDetails = await getUsers()
            if(usersDetails.success) {
                setUsers(usersDetails.success)

                const tempData = usersDetails.success.filter((item) => {
                    return item.username === user
                })[0]

                setMyData(tempData)
                const tempTotal = usersDetails.success.reduce((sum, item) => sum + item.total, 0)
                const tempMonthlyTotal = usersDetails.success.reduce((sum, item) => sum + item.monthly, 0)

                setTotalAmount(tempTotal - (tempTotal/10))
                setMonthlyTotal(tempMonthlyTotal)
                setSavings((tempTotal/10))

                const roundDetails = await getRoundDetails()
                if(roundDetails.success && roundDetails.success.length > 0) {
                    const roundDetailsHolder = roundDetails.success[0]
                    setRounds({days: roundDetailsHolder.round_days, date: roundDetailsHolder.start_date, amount: roundDetailsHolder.round_amount})

                    //get the person receiving funds from current round 
                    const tempRoundNumber = getRoundPerson(roundDetailsHolder.round_days, roundDetailsHolder.start_date)
                    setRoundNumber(tempRoundNumber)
                    //separate their details from other users
                    const tempRoundUser = usersDetails.success.filter(person => {
                        return person.round === tempRoundNumber
                    })
                    setRoundUser(tempRoundUser)
                    //get the logged-on user's days remaining to receive funds
                    const tempMyDay = daysToMyRound(tempData.round, roundDetailsHolder.start_date, roundDetailsHolder.round_days)
                    setMyDay(tempMyDay)
                    setLoading(false)
                }else {
                    setMessage({ text: roundDetails.fail || "ERROR", type: 'error'})
                    setTimeout(() => {
                        setMessage({text: '', type: ''})
                    }, 5000)
                }
            }else {
                setMessage({ text: usersDetails.fail || "ERROR", type: 'error'})
                setTimeout(() => {
                    setMessage({message: '', type: ''})
                }, 5000)
            }
        }
        fetchData()
    }, [])

    if(loading) {
        return <Text>Trying</Text>
    }

    return (
        <ImageBackground source={require('../assets/bgc1.png')} style={styles.background}>
        <SafeAreaView style = { styles.container } >
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
                message.text !== '' && <Message message={message.text} type={message.type} />
            }
            <View style = { styles.body }>
                <View style = { styles.box }>
                    <Text style = {{ fontSize: 19 }}>My progress</Text>
                    <View style = {{ flexDirection: 'row', gap: 10, alignItems: "flex-end", height: height * 0.08,justifyContent: 'space-between' }}>
                        <View style = {{gap: 10, alignItems: 'flex-start', width: 60}}>
                            <Progress.Circle
                                //lookout for error division by zero
                                progress={myData.monthly / (rounds.amount > 0 ? rounds.amount : 1)} 
                                size={60} 
                                thickness={8} 
                                color="purple" 
                                // showsText={true}  
                                />
                        </View>
                        <View style = {styles.textBox}>
                                <Text style = { styles.nameTitle }>YOU</Text>
                                <Text>Paid: {myData.monthly}</Text>
                                <Text>Extra by: {myData.extra > (myData.month * rounds.amount) ? 0 : myData.extra}</Text>
                        </View>
                        <TouchableOpacity onPress={() => navigation.navigate('more', { users: users })} activeOpacity={0.2} style = { styles.more }>
                                <MaterialIcons name="add" size={50} color={'purple'} />
                        </TouchableOpacity>
                    </View>
                    <View style = { { height: height * 0.12, flexDirection: 'row', gap: 20, alignItems: 'flex-end'} }>
                        <View style = {{gap: 10}}>
                            <Text style = {{ fontSize: 19 }}>Rounds</Text>
                            <Progress.Circle
                                    //lookout for error division by zero
                                    progress={myData.monthly / (monthlyTotal > 0 ? monthlyTotal : 1)} 
                                    size={60} 
                                    thickness={8} 
                                    color="purple" 
                                    // showsText={true}  
                                    />
                        </View>
                        <View>
                            <Text style = {{fontWeight: 800}}>Round Beneficiary: { roundUser && roundUser[0].username }</Text>
                            <Text>Collected Amount: { monthlyTotal }</Text>
                        </View>
                    </View>
                    <View style = {{height: height * 0.08}}>
                        <Text style = {{ fontSize: 17 }}>Stats</Text>
                        <Text>Days to my round: { myDay < 1 ? 'completed' : myDay }</Text>
                    </View>
                    <View style = { styles.card }>
                        <Text style = {{ fontSize: 33 }}>Balance</Text>
                        <Text style = {{ fontSize: 18, }}>Ksh. { totalAmount }</Text>
                        <Text style = {{ fontSize: 25 }}>Savings</Text>
                        <Text style = {{ fontSize: 17 }}>Ksh. { savings }</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('history', { mtdt: myData.metaData })} style = { styles.history }>
                            <Text style = {{ fontSize: 18, color: 'white', textAlign: 'center'}}>History</Text>
                        </TouchableOpacity>
                    </View>
                    <View style = {{height: height * 0.1}}>
                        <TouchableOpacity activeOpacity={0.2} style = { styles.update }>
                            <Text style = {{ fontSize: 22, color: 'purple', textAlign: 'center', fontWeight: 700}}>Request Update</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
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
    container : {
        flex: 1,
        paddingTop: Platform.OS === 'ios' ? 5 : 35
    },
    header: {
        height: height * 0.1,
        paddingHorizontal: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    option : {
        borderColor: '#ED1B24',
        borderWidth: 2,
        height: 30,
        width: 80,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
    },
    body: {
        height: height * 0.9,
        padding: 10
    },
    more: {
        borderWidth: 4,
        borderColor: 'purple',
        borderRadius: 50
    },
    box: {
        flex: 1,
        gap: 10
    },
    nameTitle: {
        fontWeight: 800,
    },
    textBox: {
        gap: 2
    },
    card: {
        height: height * 0.3,
        borderRadius: 20,
        backgroundColor: '#555555',
        alignItems: 'center',
        padding: 20,
        gap: 10
    },
    history: {
        borderWidth: 1,
        width: 120,
        backgroundColor: 'black',
        height: 40,
        borderRadius: 10,
        justifyContent: 'center'
    },
    update: {
        borderWidth: 2,
        borderColor: 'purple',
        flex: 0.7,
        alignItems: 'center',
        justifyContent: 'center',
        width: 180,
        alignSelf: 'center',
        borderRadius: 20
    }
})