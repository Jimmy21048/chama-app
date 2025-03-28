import { Text, View, StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('screen')
export default function Message({ message, type }) {
    return (
        <View style={[styles.container, {backgroundColor: type === 'error' ? 'red' : 'green'}]}>
            <Text style={styles.message}>{ message }</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 100,
        left: 50,
        width: width * 0.7,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
        borderRadius: 10
    },
    message: {
        color: 'white'
    }
})