import { Platform, SafeAreaView, StyleSheet, Dimensions, Text, View, TouchableOpacity } from "react-native";
import { StatusBar } from "expo-status-bar";
import { MaterialIcons } from "@expo/vector-icons";

const { width, height } = Dimensions.get('screen')
export default function Admin({ navigation, route }) {
    const { user } = route.params

    const handleSettings = () => {
        
    }

    return (
        <SafeAreaView style = { styles.container }>
            <StatusBar style="dark" />
            <View style = { styles.header }>
                <Text style = {{ 
                    fontSize: 30, borderColor: '#000000', 
                    borderWidth: 4, width: 50, height: 50, 
                    textAlign: 'center', borderRadius: 50 }}
                >{user.at(0)}</Text>
                <TouchableOpacity activeOpacity={0.6} onPress={() => navigation.navigate('modal')} >
                    <MaterialIcons name="settings" color={'black'} size={40} />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingTop: Platform.OS === 'android' ? 30 : 5,
        flex: 1
    },
    header: {
        height: height * 0.1,
        paddingHorizontal: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    }
})