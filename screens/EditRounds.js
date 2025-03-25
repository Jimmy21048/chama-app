import { View, Text, StyleSheet, TextInput, ScrollView, Dimensions } from 'react-native'
import { useState } from 'react'
import Button from '../components/Button'

const { width, height } = Dimensions.get('screen')
export default function EditRounds({ route }) {
    const { users } = route.params
    const[userList, setUserList] = useState(users)
    const[changedUsers, setChangedUsers] = useState(users)
    const[updatedRounds, setUpdatedRounds] = useState([])
    const[searchParam, setSearchParam] = useState('')
    const[updateRounds, setUpdateRounds] = useState(false)
    
    const handleSearchMember = (val) => {
        setSearchParam(val)
        const filteredUsers = users.filter((user) => {
            return user.username.toLowerCase().includes(val.toLowerCase())
        })
        setUserList(filteredUsers)
    }

    const handleChangeText = (val, index) => {
        const tempArray = updatedRounds
        const tempUpdatedUser = users[index]
        if(val > 0 && val !== '') {
            for(let i = 0; i < tempArray.length; i++) {
                if(tempArray[i].username === tempUpdatedUser.username) {
                    tempArray.splice(i, 1)
                }
            }
            tempArray.push({username: tempUpdatedUser.username, round: val})
            setUpdatedRounds(tempArray)
            setUpdateRounds(true)
        }

    }

    const handleUpdateRounds = () => {
        // console.log(updatedRounds)
        const tempArray = users
        for(let i =0; i < tempArray.length; i++) {
            for(let j = 0; j < updatedRounds.length; j++) {
                if(tempArray[i].username === updatedRounds[j].username) {
                    // console.log(tempArray[i].round, updatedRounds[j].round)
                    tempArray[i].round = updatedRounds[j].round
                    // console.log(tempArray[i].round)
                }
            }
        }

        console.log(tempArray)
    }

    return (
        <View style={styles.container}>
            <View  style={styles.updates}>
                <TextInput placeholder='search for member...' style={styles.search} value={searchParam} onChangeText={(val) => handleSearchMember(val) } />
                {
                    updateRounds && 
                    <Button text={'UPDATE'} height={40} width={width * 0.2} br={10} bgc={'green'} onPress={handleUpdateRounds} />
                }
            </View>
            <ScrollView style={{flexGrow: 1}}>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10, backgroundColor: 'gray', padding: 5}}>
                    <Text style={styles.text}>Username</Text>
                    <Text style={styles.text}>Round</Text>
                </View>
                {
                    userList.map((user, index) => {
                        return (
                            <View key={index} style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10}}>
                                <Text  style={styles.text}>{user.username}</Text>
                                <TextInput style={styles.input} defaultValue={user.round.toString()} onChangeText={(val) => handleChangeText(val, index)} />
                            </View>
                        )
                    })
                }
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 20
    },
    updates: {
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        height: height * 0.08
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
    search : {
        height: 40,
        padding: 10,
        gap: 30,
        borderWidth: 1,
        borderColor: 'gray',
        borderRadius: 10,
        width: width * 0.6
    },
})