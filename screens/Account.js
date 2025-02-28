import { View, Text, StyleSheet, SafeAreaView, Platform, TouchableOpacity, Dimensions } from "react-native";
import * as SecureStore from 'expo-secure-store'
import { MaterialIcons } from "@expo/vector-icons";

const { height, width } = Dimensions.get('screen')
export default function Home({ navigation, route }) {
    const { user } = route.params
    const handleDeleteAccount = async () => {
        await SecureStore.deleteItemAsync('user')
        .then(() => {
            navigation.navigate('sign')
        })
    }
    return (
        <SafeAreaView style = { styles.container } >
            <View style = { styles.header }>
                <Text style = {{ 
                    fontSize: 30, borderColor: '#000000', 
                    borderWidth: 4, width: 50, height: 50, 
                    textAlign: 'center', borderRadius: 50 }}
                >{user.at(0)}</Text>
                {/* <TouchableOpacity  style = {styles.option } onPress={handleDeleteAccount}>
                    <Text style = {{color: '#ED1B24', fontWeight: 800}}>Delete</Text>
                </TouchableOpacity> */}
                <TouchableOpacity activeOpacity={0.6} onPress={() => navigation.navigate('modal')} >
                    <MaterialIcons name="settings" color={'black'} size={40} />
                </TouchableOpacity>
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
})