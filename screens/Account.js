import { View, Text, StyleSheet, SafeAreaView, Platform, TouchableOpacity, Dimensions } from "react-native";
import * as Progress from 'react-native-progress';
import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";

const { height, width } = Dimensions.get('screen')
export default function Home({ navigation, route }) {
    const { user, pwd } = route.params

    const[progress, setProgress] = useState(0.7)
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
                    <Text style = {{ fontSize: 17 }}>This week</Text>
                    <Progress.Circle
                        progress={0.8} 
                        size={60} 
                        thickness={8} 
                        color="#007bff" 
                        showsText={true}  />
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
        // borderColor: 'black',
        // borderWidth: 1,
        // flex: 0.1,
        // flexDirection: 'row',
        // alignItems: 'center',
        // justifyContent: 'flex-end',
        // padding: 10
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
    }
})