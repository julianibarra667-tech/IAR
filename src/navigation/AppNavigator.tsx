import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { AuthProvider } from "../context/AuthContext";
import { ProductsProvider } from "../context/ProductsContext";
import { RewardsProvider } from "../context/RewardsContext";
import { ThemeProvider } from "../context/ThemeContext";
import { LoginScreen } from "../screens/LoginScreen";
import { ProductsScreen } from "../screens/ProductsScreen";
import { ProductConfigScreen } from "../screens/ProductConfigScreen";
import { ProfileScreen } from "../screens/ProfileScreen";
import { RegisterScreen } from "../screens/RegisterScreen";
import { RewardsScreen } from "../screens/RewardsScreen";
import { RewardConfigScreen } from "../screens/RewardConfigScreen";
import { SettingsScreen } from "../screens/SettingsScreen";
import { TermsScreen } from "../screens/TermsScreen";
import type { RootStackParamList } from "./types";

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
    return (
      <ThemeProvider>
        <AuthProvider>
          <ProductsProvider>
            <RewardsProvider>
              <NavigationContainer>
                  <Stack.Navigator initialRouteName="LoginScreen" screenOptions={{ headerShown: false, animation: "slide_from_right" }}>
                      <Stack.Screen name="ProfileScreen"
                          component={ProfileScreen} />
                      <Stack.Screen name="ProductsScreen"
                          component={ProductsScreen} />
                      <Stack.Screen name="ProductConfigScreen"
                          component={ProductConfigScreen} />
                      <Stack.Screen name="RewardConfigScreen"
                          component={RewardConfigScreen} />
                      <Stack.Screen name="LoginScreen"
                          component={LoginScreen} />
                      <Stack.Screen name="RegisterScreen"
                          component={RegisterScreen} />
                      <Stack.Screen name="RewardsScreen"
                          component={RewardsScreen} />
                      <Stack.Screen name="SettingsScreen"
                          component={SettingsScreen} />
                      <Stack.Screen name="TermsScreen"
                          component={TermsScreen} />
                  </Stack.Navigator>
              </NavigationContainer>
            </RewardsProvider>
          </ProductsProvider>
        </AuthProvider>
      </ThemeProvider>
    );
}