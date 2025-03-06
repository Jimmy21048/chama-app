import { useState } from "react";
import { View, Text, StyleSheet } from "react-native";

export default function History({ route }) {
    const { mtdt } = route.params
    const parsedMtdt = JSON.parse(mtdt)
    const[history, setHistory] = useState(parsedMtdt)
    
    return (
        <View style = { styles.container }>
            {
                history.map(item => {
                    return <Text style = {{ fontSize: 19, fontWeight: 700 }}>{item.date} {item.amount}</Text> 
                })
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 20
    }
})