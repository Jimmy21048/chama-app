import { View, Text, StyleSheet, SafeAreaView, Platform, TouchableOpacity } from "react-native";
import * as SecureStore from 'expo-secure-store'

export default function Home({ navigation }) {
    const handleDeleteAccount = async () => {
        await SecureStore.deleteItemAsync('user')
        .then(() => {
            navigation.navigate('sign')
        })
    }
    return (
        <SafeAreaView style = { styles.container } >
            <View style = { styles.header }>
                <TouchableOpacity  style = {styles.option } onPress={handleDeleteAccount}>
                    <Text style = {{color: '#ED1B24', fontWeight: 800}}>Delete</Text>
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
        borderColor: 'black',
        borderWidth: 1,
        flex: 0.1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: 10
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