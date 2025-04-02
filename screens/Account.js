import { View, Text, StyleSheet, SafeAreaView, Platform, TouchableOpacity, Dimensions } from "react-native";
import * as Progress from 'react-native-progress';
import { MaterialIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import axios from "axios";
import { HOST } from '@env'
import { getRoundPerson } from '../functions/functions'
import { daysToMyRound } from "../functions/functions";

const { height, width } = Dimensions.get('screen')
export default function Home({ navigation, route }) {
    const { user, pwd } = route.params
    const[users, setUsers] = useState([])
    const[myData, setMyData] = useState({
        weekly: 1,
        metaData: []
    })
    const[progress, setProgress] = useState(0.5)
    const[totalAmount, setTotalAmount] = useState(0)
    const[savings, setSavings] = useState(0)
    const[rounds, setRounds] = useState({days: 0, date: '01/01/2025'})
    const total = 1000

    useEffect(() => {
        axios.get(`http://${HOST}:3000/getUsers`)
        .then(res => {
            if(res.data.success) {
                setUsers(res.data.success)

                const tempData = res.data.success.filter((item) => {
                    return item.username === user
                })[0]
                
                setMyData(tempData)

                const tempTotal = res.data.success.reduce((sum, item) => sum + item.total, 0)

                setTotalAmount(tempTotal - (tempTotal/10))
                setSavings((tempTotal/10))

                //new


            } else {
                //code for message
            }
        })

        axios.get(`http://${HOST}:3000/getRoundDetails`)
        .then(response => {
            if(response.data.success) {
                const data = response.data.success[0]
                setRounds({days: data.round_days, date: data.start_date})
            }
        })

    }, [])

    const roundNumber = getRoundPerson(30, '2025-02-01')
    const roundUser = users.filter(person => {
        return person.round === roundNumber
    })

    const myDay = daysToMyRound(2, '2025-02-01', 30)
    console.log(myDay)

    return (
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
            <View style = { styles.body }>
                <View style = { styles.box }>
                    <View style = {{ flexDirection: 'row', gap: 10, alignItems: "flex-end", height: height * 0.12,justifyContent: 'space-between' }}>
                        <View style = {{gap: 10, alignItems: 'center', width: 70 }}>
                            <Text style = {{ fontSize: 19 }}>Week</Text>
                            <Progress.Circle
                                progress={myData.weekly / 150} 
                                size={60} 
                                thickness={8} 
                                color="purple" 
                                showsText={true}  />
                        </View>
                        <View style = {styles.textBox}>
                                <Text style = { styles.nameTitle }>YOU</Text>
                                <Text>Paid: {myData.weekly}</Text>
                                <Text>Arr: {150 - myData.weekly}</Text>
                        </View>
                        <TouchableOpacity onPress={() => navigation.navigate('more', { users: users })} activeOpacity={0.2} style = { styles.more }>
                                <MaterialIcons name="add" size={50} color={'purple'} />
                        </TouchableOpacity>
                    </View>
                    <View style = { { height: height * 0.12, flexDirection: 'row', gap: 20, alignItems: 'flex-end'} }>
                        <View style = {{gap: 10}}>
                            <Text style = {{ fontSize: 19 }}>Month</Text>
                            <Progress.Circle
                                    progress={0.9} 
                                    size={60} 
                                    thickness={8} 
                                    color="purple" 
                                    showsText={true}  />
                        </View>
                        <View>
                            <Text style = {{fontWeight: 800}}>Round Beneficiary: { roundUser && roundUser[0].username }</Text>
                            <Text>Total Amount: 1300</Text>
                            <Text>Current Balance: 1300</Text>
                        </View>
                    </View>
                    <View style = {{height: height * 0.1}}>
                        <Text style = {{ fontSize: 17 }}>Stats</Text>
                        <Text>Days to my round: { myDay && myDay }</Text>
                        <Text>Amount to your next round: 650</Text>
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
    )
}

const styles = StyleSheet.create({
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
        padding: 10,
        
    },
    more: {
        borderWidth: 4,
        borderColor: 'purple',
        borderRadius: 50
    },
    box: {
        flex: 1,
        gap: height * 0.01
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