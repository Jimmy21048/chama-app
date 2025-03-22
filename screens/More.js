import { View, Text, StyleSheet, ScrollView } from "react-native";

export default function More({ route }) {
    const { users } = route.params

    return (
        <View style = { styles.container }>
            <Text style = {{ fontSize: 19, fontWeight: 700 }}>Other Members</Text>
            <ScrollView  style = { styles.members }>
                <View style = { styles.content } >
                {
                    users.map((user) => {
                        return <View key = { user.id } style = { styles.userBox }>
                            <Text>{ user.username }</Text>
                            <Text>Total Savings: { user.total }</Text>
                        </View>
                    })
                }
                </View>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        padding: 20
    },
    members: {
        flexGrow: 1
    },
    content: {
        paddingVertical: 10,
        gap: 20
    },
    userBox: {
        height: 70,
        borderRadius: 15,
        padding: 15,
        backgroundColor: '#E5E4E2'
    }
})