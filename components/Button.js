import { TouchableOpacity, Text, StyleSheet } from "react-native";

export default function Button({text, height, width, br, bgc, onPress}) {
    return (
        <TouchableOpacity activeOpacity={0.6} style={[styles.container, {height: height, width: width, borderRadius: br, backgroundColor: bgc}]} onPress={() => onPress()}>
            <Text style={{fontWeight: 700}}>{text}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    }
})