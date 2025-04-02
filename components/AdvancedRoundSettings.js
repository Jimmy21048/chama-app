import { View, StyleSheet, TextInput, Text, Dimensions } from "react-native";
import Button from "./Button";
import axios from "axios";
import { useEffect, useState } from "react";
import { HOST } from '@env'
import Message from "./Message";

const { width } = Dimensions.get('screen')
export default function Advanced() {
    const[rounds, setRounds] = useState({days: 30, date: '01/01/2025'})
    const[disabled, setDisabled] = useState(true)
    const[message, setMessage] = useState({text: '', type: ''})
    useEffect(() => {
        axios.get(`http://${HOST}:3000/getRoundDetails`)
        .then(response => {
            if(response.data.success) {
                const data = response.data.success[0]
                setRounds({days: data.round_days, date: data.start_date})
            } else {
                setMessage({ message: 'Error Loading Details', type: 'error'})
                setTimeout(() => {
                    setMessage({message: '', type: ''})
                }, 5000)
            }
        })
    }, [])

    const handleDisableInput = () => {
        setDisabled(!disabled)
    }

    const handleChangeRounds = () => {
        axios.post(`http://${HOST}:3000/changeRoundDetails`, { rounds })
        .then(response => {
            if(response.data.success) {
                setDisabled(true)
            }
        })
    }
    return (
        <View style = { styles.container }>
        {/* {
            message.text !== '' && <Message message={message.text} type={message.type} />
        } */}
            <Button text={'EDIT'} height={35} width={80} br={10} bgc={'#990000'} onPress={handleDisableInput}  />
            <View style = {{flexDirection: 'row', justifyContent: 'space-between', width: 300}}>
                <Text style = { styles.text }>Days per Round: </Text>
                <TextInput editable={disabled ? false : true} value={rounds.days.toString()} style = { styles.input } onChangeText={(val) => setRounds({...rounds, days: val})} />
            </View>
            <View style = {{flexDirection: 'row', justifyContent: 'space-between', width: 300}}>
                <Text style = { styles.text }>Chama start Date:</Text>
                <TextInput editable={disabled ? false : true} value={rounds.date} style = { styles.input } onChangeText={(val) => setRounds({...rounds, date: val})}/>
            </View>
            <Button text={'SAVE CHANGES'} height={40} width={150} br={10} bgc={'#2A3439'} onPress={handleChangeRounds} />
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