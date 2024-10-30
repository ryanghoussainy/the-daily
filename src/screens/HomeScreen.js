import { Text } from "@rneui/themed";
import { StyleSheet, TouchableOpacity, View, Dimensions } from "react-native";
import Svg, { Path } from "react-native-svg";
import Colours from "../config/Colours";
import { useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons"

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
      {/* Title */}
      <Text style={styles.title}>THE DAILY</Text>

      {/* Veritical dotted line down the middle */}
      <View style={styles.middleLine} />

      {/* Stats box */}
      <TouchableOpacity style={[styles.box, styles.rightBox]} onPress={() => navigation.navigate("Stats")}>
        <AntDesign name="linechart" size={80} color={Colours.blue} style={styles.chartIcon}/>
        <Text style={styles.boxTitle}>Stats</Text>
      </TouchableOpacity>

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
  title: {
    color: Colours.title,
    fontSize: 45,
    marginTop: 50,
  },
  middleLine: {
    borderLeftWidth: 1,
    borderColor: Colours.text,
    height: 600,
    borderStyle: "dotted",
    marginTop: 20,
  },
  box: {
    width: "40%",
    height: "20%",
    borderRadius: 10,
    borderWidth: 0.7,
    borderColor: Colours.lightblue,
    position: "absolute",
    top: "35%",
    alignItems: "center",
  },
  rightBox: {
    right: "5%",
  },
  leftBox: {
    left: "5%",
  },
  boxTitle: {
    color: Colours.text,
    fontSize: 18,
    marginTop: 15,
  },
  chartIcon: {
    marginTop: 30,
  },
});
