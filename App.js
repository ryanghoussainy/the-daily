import { View } from "react-native";
import { StatusBar } from "expo-status-bar";
import StackNavigator from "./src/navigation/StackNavigator";

export default function App() {
  return (
    <View style={{ flex: 1 }}>
      <StackNavigator />
      <StatusBar style="light" />
    </View>
  );
}
