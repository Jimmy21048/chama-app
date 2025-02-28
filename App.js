import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Sign from './screens/Sign'
import Account from './screens/Account'
import Admin from './screens/Admin'
import Modal from './screens/Modal'

const Stack = createNativeStackNavigator()

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Group>
          <Stack.Screen
          name='sign'
          component={Sign}
          options={{headerShown: false}} />

          <Stack.Screen
          name='account'
          component={Account}
          options={{headerShown: false}} />

          <Stack.Screen
          name='admin'
          component={Admin}
          options={{headerShown: false}} />
        </Stack.Group>
        <Stack.Group screenOptions={{ presentation: 'modal' }}>
            <Stack.Screen name="modal" component={Modal} />
        </Stack.Group>
      </Stack.Navigator>
    </NavigationContainer>
  )
}