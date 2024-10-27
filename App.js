import { View } from "react-native";
import ExercisesScreen from "./src/screens/ExercisesScreen";
import { StatusBar } from "expo-status-bar";

export default function App() {
  return (
    <View style={{ flex: 1 }}>
      <ExercisesScreen />
      <StatusBar style="light" />
    </View>
  );
}
