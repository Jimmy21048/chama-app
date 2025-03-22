import { useState } from "react";
import { View, Text, StyleSheet } from "react-native";

export default function History({ route }) {
    const { mtdt } = route.params
    const parsedMtdt = JSON.parse(mtdt)
    const[history, setHistory] = useState(parsedMtdt)
    
    return (
        <View style = { styles.container }>
            <View style = { styles.history }>
                <Text  style = {{ fontSize: 19, fontWeight: 700 }}>DATE</Text>
                <Text  style = {{ fontSize: 19, fontWeight: 700 }}>AMOUNT</Text>
            </View>
            {
                history.map((item, index) => {
                    return <View key = {index} style = {styles.history}>
                        <Text  style = {{ fontSize: 19, fontWeight: 600 }}>{item.date}</Text>
                        <Text  style = {{ fontSize: 19, fontWeight: 600 }}>{item.amount}</Text>
                    </View> 
                })
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 20
    },
    history: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    }
})