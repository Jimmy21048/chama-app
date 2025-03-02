import { View, Text, StyleSheet, SafeAreaView, Platform, TouchableOpacity, Dimensions } from "react-native";
import * as Progress from 'react-native-progress';
import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";

const { height, width } = Dimensions.get('screen')
export default function Home({ navigation, route }) {
    const { user, pwd } = route.params

    const[progress, setProgress] = useState(0.5)
    const total = 1000

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
                                progress={progress} 
                                size={60} 
                                thickness={8} 
                                color="purple" 
                                showsText={true}  />
                        </View>
                        <View style = {styles.textBox}>
                                <Text style = { styles.nameTitle }>Jimmy</Text>
                                <Text>Bal: 450</Text>
                                <Text>Arr: 250</Text>
                        </View>
                        <TouchableOpacity onPress={() => navigation.navigate('more')} activeOpacity={0.2} style = { styles.more }>
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
                            <Text style = {{fontWeight: 800}}>Round Beneficiary: Jimmy</Text>
                            <Text>Total Amount: 1300</Text>
                            <Text>Current Balance: 1300</Text>
                        </View>
                    </View>
                    <View style = {{height: height * 0.1}}>
                        <Text style = {{ fontSize: 17 }}>Stats</Text>
                        <Text>Weeks to your round: 20</Text>
                        <Text>Amount to your next round: 650</Text>
                    </View>
                    <View style = { styles.card }>
                        <Text style = {{ fontSize: 33 }}>Balance</Text>
                        <Text style = {{ fontSize: 18, }}>Ksh. 4000.00</Text>
                        <Text style = {{ fontSize: 25 }}>Savings</Text>
                        <Text style = {{ fontSize: 17 }}>Ksh. 400</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('history')} style = { styles.history }>
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