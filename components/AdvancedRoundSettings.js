import { View, StyleSheet, TextInput, Text, Dimensions } from "react-native";
import Button from "./Button";
import axios from "axios";
import { useEffect, useState } from "react";
import { HOST } from '@env'

const { width } = Dimensions.get('screen')
export default function Advanced() {
    const[rounds, setRounds] = useState({days: 30, date: '01/01/2025'})
    const[disabled, setDisabled] = useState(true)
    useEffect(() => {
        axios.get(`http://${HOST}:3000/getRoundDetails`)
        .then(response => {

        })
    }, [])
    return (
        <View style = { styles.container }>
            <Button text={'EDIT'} height={35} width={80} br={10} bgc={'#990000'}  />
            <View style = {{flexDirection: 'row', justifyContent: 'space-between', width: 300}}>
                <Text style = { styles.text }>Days per Round: </Text>
                <TextInput disabled={disabled ? 'on' : 'off'} value={rounds.days.toString()} style = { styles.input } />
            </View>
            <View style = {{flexDirection: 'row', justifyContent: 'space-between', width: 300}}>
                <Text style = { styles.text }>Chama start Date:</Text>
                <TextInput  value={rounds.date} style = { styles.input } />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: 300,
        marginBottom: 100,
        alignItems: 'flex-start',
        gap: 10
    },
    text: {
        fontWeight: 'bold',
        fontSize: 19
    },
    input: {
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 5,
        width: 100,
        textAlign: 'center',
        height: 40
    },
})