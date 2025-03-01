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
                    <View style = {{ flexDirection: 'row', gap: 10, alignItems: "flex-end" }}>
                        <View style = {{gap: 10, alignItems: 'center', width: 70 }}>
                            <Text style = {{ fontSize: 17 }}>Week</Text>
                            <Progress.Circle
                                progress={progress} 
                                size={60} 
                                thickness={8} 
                                color="#007bff" 
                                showsText={true}  />
                        </View>
                        <View style = {{ flexDirection: 'row', gap: 20}}>
                            <View style = {styles.textBox}>
                                <Text style = { styles.nameTitle }>Jimmy</Text>
                                <Text>Bal: 450</Text>
                                <Text>Arr: 250</Text>
                            </View>
                            <View>
                                <Text style = { styles.nameTitle }>Enock</Text>
                                <Text>Bal: 450</Text>
                                <Text>Arr: 250</Text>
                            </View>
                            <View>
                                <Text style = { styles.nameTitle }>stacy</Text>
                                <Text>Bal: 450</Text>
                                <Text>Arr: 250</Text>
                            </View>
                            <View>
                                <Text style = { styles.nameTitle }>Fedy</Text>
                                <Text>Bal: 450</Text>
                                <Text>Arr: 250</Text>
                            </View>
                        </View>
                    </View>
                    <View style = { { height: 100, flexDirection: 'row', gap: 20, alignItems: 'center'} }>
                        <View style = {{gap: 10}}>
                            <Text style = {{ fontSize: 17 }}>Month</Text>
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
                    <View style = { styles.card }>
                        <Text style = {{ fontSize: 33 }}>Balance</Text>
                        <Text style = {{ fontSize: 18 }}>Ksh. 4000.00</Text>
                        <Text style = {{ fontSize: 25 }}>Savings</Text>
                        <Text style = {{ fontSize: 17 }}>Ksh. 400</Text>
                        <TouchableOpacity style = { styles.history }>
                            <Text style = {{ fontSize: 18, color: 'white', textAlign: 'center'}}>History</Text>
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
        backgroundColor: '#E5E4E2',
        padding: 10
    },
    box: {
        // flexDirection: 'row',
        // gap: 5
        gap: 40
    },
    nameTitle: {
        fontWeight: 800,
        // fontSize: 16
    },
    textBox: {
        gap: 2
    },
    card: {
        height: height * 0.3,
        borderColor: 'orange',
        borderWidth: 1,
        borderRadius: 20,
        backgroundColor: 'orange',
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
    }
})