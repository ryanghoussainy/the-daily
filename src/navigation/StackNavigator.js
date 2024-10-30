import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import ExercisesScreen from "../screens/ExercisesScreen";
import StatsScreen from "../screens/StatsScreen";

const Stack = createNativeStackNavigator();

export default function StackNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right",
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Exercises" component={ExercisesScreen} />
        <Stack.Screen name="Stats" component={StatsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
