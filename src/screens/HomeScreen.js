import { Text } from "@rneui/themed";
import { StyleSheet, TouchableOpacity, View, Dimensions } from "react-native";
import Svg, { Path } from "react-native-svg";
import Colours from "../config/Colours";
import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";

export default function HomeScreen() {
  // Dynamic width in case of resizing
  const [width, setWidth] = useState(Dimensions.get("window").width);

  useEffect(() => {
    const subscription = Dimensions.addEventListener("change", ({ window }) => {
      setWidth(window.width);
    });

    return () => subscription.remove(); // Clean up the event listener
  }, []);

  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Bottom curved shape */}
      <View style={styles.curvedContainer}>
        <Svg
          width={width}
          height="200"
          viewBox={`0 0 ${width} 200`}
          style={styles.curve}
        >
          <Path
            d={`M0,100 Q${width / 2},0 ${width},100 L${width},200 L0,200 Z`}
            fill={Colours.darkgrey}
          />
        </Svg>

        {/* Button half in and half out of the curve */}
        <TouchableOpacity
          style={styles.addLogButton}
          onPress={() => navigation.navigate("Exercises")}
        >
          <Text style={styles.addLogButtonText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colours.bg,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  curvedContainer: {
    width: "100%",
    height: 200,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: 0,
  },
  curve: {
    position: "absolute",
    bottom: 0,
  },
  addLogButton: {
    backgroundColor: Colours.blue,
    width: 80,
    height: 80,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: 20,
  },
  addLogButtonText: {
    fontSize: 40,
    fontWeight: "bold",
    color: "white",
  },
});
