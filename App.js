import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import Sign from './screens/Sign'
import Account from './screens/Account'
import Admin from './screens/Admin'
import Modal from './screens/Modal'
import More from "./screens/More";
import History from "./screens/History";
import EditRounds from "./screens/EditRounds";
import { UsersProvider } from "./helpers/UsersContext";

const Stack = createNativeStackNavigator()

export default function App() {
  return (
    <UsersProvider>
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
              <Stack.Screen name="history" component={History} />
              <Stack.Screen name="more" component={More} />
              <Stack.Screen name="rounds" component={EditRounds} />
          </Stack.Group>
        </Stack.Navigator>
      </NavigationContainer>
    </UsersProvider>

  )
}