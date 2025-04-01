import { View, Text, StyleSheet, TextInput, ScrollView, Dimensions, Alert } from 'react-native'
import { useState } from 'react'
import Button from '../components/Button'
import axios from 'axios'
import { HOST } from '@env'
import Message from '../components/Message'
import { useUsers } from '../helpers/UsersContext'

const { width, height } = Dimensions.get('screen')
export default function EditRounds({ navigation, route }) {
    const { user, pwd } = route.params
    const { users, setUsers } = useUsers()
    const[userList, setUserList] = useState([...users])
    const[changedUsers, setChangedUsers] = useState([...users])
    const[updatedRounds, setUpdatedRounds] = useState([])
    const[searchParam, setSearchParam] = useState('')
    const[updateRounds, setUpdateRounds] = useState(false)
    const[message, setMessage] = useState({text: '', type: ''})
    
    const handleSearchMember = (val) => {
        setSearchParam(val)
        const filteredUsers = changedUsers.filter((user) => {
            return user.username.toLowerCase().includes(val.toLowerCase())
        })
        setUserList(filteredUsers)
    }

    const handleChangeText = async (val, index) => {
        const tempArray = updatedRounds
        const tempUpdatedUser = await userList.find(user => user.id === index)

        if(val > 0 && val !== '') {
            for(let i = 0; i < tempArray.length; i++) {
                if(tempArray[i].username === tempUpdatedUser.username) {
                    tempArray.splice(i, 1)
                }
            }
            tempArray.push({username: tempUpdatedUser.username, round: val})
            setUpdatedRounds(tempArray)

            setChangedUsers((prev) => {
                return prev.map(user => {
                    if(user.username === tempUpdatedUser.username) {
                        
                        return {...user, round: val}
                    } else {
                        return user
                    }
                })
            }) 

            setUpdateRounds(true)
        }
    }

    const handleUpdateRounds = () => {
        setUserList(changedUsers)
        setUsers(changedUsers)
        let tempArray = changedUsers.sort((a, b) => a.round - b.round)
        let roundErrors = []
        
        for(let i = 0; i < tempArray.length; i++) {
            let x = tempArray.find(item => Number(item.round) === i + 1)
            if(x === undefined) {
                roundErrors.push("Round " + (i+1) + " is missing")
            }

            if(Number(tempArray[i].round) < 1) {
                roundErrors.push(`${tempArray[i].username} has an invalid round number ${tempArray[i].round}`)
            }

            if(Number(tempArray[i].round) > tempArray.length) {
                roundErrors.push(`${tempArray[i].username}'s round exceeds the number of members`)
            }

            let occurs = tempArray.filter(item => Number(item.round) === (i + 1)).length
            if(occurs > 1) {
                roundErrors.push(`Round ${i + 1} has been assigned ${occurs} times`)
            }

        }

        if(roundErrors.length > 0) {
            Alert.alert('Errors', roundErrors.join('\n'))
            return
        } else {
            Alert.alert(
                'Update Rounds',
                `The following members will be updated: ${updatedRounds.map(item => `${item.username} : Round ${item.round}`).join('\n')}`,
                [
                    {
                        text: "Cancel",
                        style: "cancel"
                    },
                    {
                        text: "Update",
                        onPress: () => {
                            axios.post(`http://${HOST}:3000/updateRounds`, {users: updatedRounds})
                            .then(response => {
                                if(response.data.success) {
                                    setMessage({text: 'Rounds Updated Successfully', type: 'success'})
                                    setTimeout(() => {
                                        setMessage({text: '', type: ''})
                                    }, 5000)
                                    setUpdateRounds(false)
                                    setUpdatedRounds([])
                                    setUserList(changedUsers)
                                    navigation.navigate('admin', { user, pwd })
                                } else {
                                    setMessage({text: 'Error Updating Rounds', type: 'error'})
                                    setTimeout(() => {
                                        setMessage({text: '', type: ''})
                                    }, 5000)

                                }
                            })
                        }
                    }
                ]
            )
        }

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
            {
                message.text !== '' && 
                <Message message={message.text} type={message.type} />
            }
            <ScrollView style={{flexGrow: 1}}>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10, backgroundColor: 'gray', padding: 5}}>
                    <Text style={styles.text}>Username</Text>
                    <Text style={styles.text}>Round</Text>
                </View>
                {
                    userList.sort((a,b) => b.round - a.round ).map((user, index) => {
                        return (
                            <View key={index} style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10}}>
                                <Text  style={styles.text}>{user.username}</Text>
                                <TextInput style={styles.input} keyboardType='numeric' defaultValue={user.round.toString()} onChangeText={(val) => handleChangeText(val, user.id)} />
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