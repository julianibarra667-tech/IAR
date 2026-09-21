import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { LoginScreen } from "../screens/LoginScreen";
import { ProductsScreen } from "../screens/ProductsScreen";
import { ProfileScreen } from "../screens/ProfileScreen";
import { RewardsScreen } from "../screens/RewardsScreen";
import { SettingsScreen } from "../screens/SettingsScreen";

type RootStackParamList = {
    ProfileScreen: undefined;
    ProductsScreen: undefined;
    LoginScreen: undefined;
    RewardsScreen: undefined;
    SettingsScreen: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
    return (
        <NavigationContainer>
            
            <Stack.Navigator initialRouteName="LoginScreen" screenOptions={{ headerShown: false, animation: "slide_from_right" }}>
                <Stack.Screen name="ProfileScreen" 
                    component={ProfileScreen} />
                <Stack.Screen name="ProductsScreen" 
                    component={ProductsScreen} />
                <Stack.Screen name="LoginScreen"
                    component={LoginScreen} />
                <Stack.Screen name="RewardsScreen"
                    component={RewardsScreen} />
                <Stack.Screen name="SettingsScreen"
                    component={SettingsScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}