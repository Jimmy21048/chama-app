import { View, Text, StyleSheet } from "react-native";
import Button from "./Button";

export default function Rounds({ navigation, users }) {
    const currentRound = users.filter((user) => {
        return user.round === 1
    })

    const handleEditRounds = () => {
        navigation.navigate('rounds')
    }

    return (
        <View style={styles.container}>
            <Text>Current Round</Text>
            <Text>{ currentRound.length > 0 && currentRound[0].username }</Text>
            <Button onPress={handleEditRounds}
            text={'view rounds'}
            height={40}
            width={90}
            br={10}
            bgc={'gray'}/>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    }
})