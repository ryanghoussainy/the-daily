import { useEffect, useState } from "react";
import {
  View,
  Dimensions,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import Colours from "../config/Colours";
import { StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Feather, Ionicons } from "@expo/vector-icons";
import { fetchLogs, updateLog } from "../operations/ExerciseLog";
import { fetchExercises } from "../operations/Exercises";
import {
  GestureHandlerRootView,
  PanGestureHandler,
  TapGestureHandler,
  TextInput,
  TouchableWithoutFeedback,
} from "react-native-gesture-handler";
import { Circle } from "react-native-svg";

const CHART_TOP_MARGIN = 75;

// offset for y axis values
const YAXIS_OFFSET = 64;

export default function StatsScreen() {
  // Dynamic width in case of resizing
  const [width, setWidth] = useState(Dimensions.get("window").width);
  const [chartWidth, setChartWidth] = useState(width - 20);
  const chartHeight = 300;

  useEffect(() => {
    const subscription = Dimensions.addEventListener("change", ({ window }) => {
      setWidth(window.width);
      setChartWidth(window.width - 20);
    });

    return () => subscription.remove(); // Clean up the event listener
  }, []);

  const navigation = useNavigation();

  // State for logs
  const [logs, setLogs] = useState([]);

  const _fetchLogs = async () => {
    setLoadingLogs(true);
    await fetchLogs("Ryan", setLogs);
    setLoadingLogs(false);
  };

  useEffect(() => {
    _fetchLogs();
  }, []);

  // Loading for fetching logs
  // Note: Without this, the chart would cause an error trying to
  // render when the logs haven't been fetched yet.
  const [loadingLogs, setLoadingLogs] = useState(true);

  // State for exercises
  const [exerciseNames, setExerciseNames] = useState([]);

  useEffect(() => {
    fetchExercises((exercises) => {
      setExerciseNames(exercises.map((exercise) => exercise.name));
    });
  }, []);

  // Function separating filtering list of logs for an exercise
  const filterLogs = (exerciseName) => {
    return logs
      .filter((log) => log.exercise === exerciseName)
      .map((log) => ({ reps: log.reps, date: log.date }));
  };

  // Get random RGBA values (opacity is always 1), used for shuffling chart colours
  const getRandomRGBA = () => {
    return exerciseNames.reduce((acc, exerciseName) => {
      const r = Math.floor(Math.random() * 256);
      const g = Math.floor(Math.random() * 256);
      const b = Math.floor(Math.random() * 256);
      acc[exerciseName] = `rgba(${r}, ${g}, ${b}, 1)`;
      return acc;
    }, {});
  };

  // State for array of colours (one per line)
  const [exerciseColours, setExerciseColours] = useState(getRandomRGBA());

  // Shuffle colours
  const shuffleColours = () => {
    setExerciseColours(getRandomRGBA());
  };

  // If the exercises change, reshuffle colours
  useEffect(() => {
    shuffleColours();
  }, [exerciseNames]);

  // Tooltips
  const [tooltip, setTooltip] = useState({
    visible: false,
    x: 0,
    y: 0,
    values: null,
    index: -1,
  });

  const calculateClosestDataPoint = (gestureX) => {
    const numDataPoints = data.datasets[0].data.length; // Get the number of data points
    const pointSpacing = (chartWidth - YAXIS_OFFSET) / numDataPoints; // Calculate spacing between points

    // Calculate the closest index based on the gesture's x position
    const closestIndex = Math.round((gestureX - YAXIS_OFFSET) / pointSpacing);

    // Clamp the index to be within the valid range
    const clampedIndex = Math.max(0, Math.min(closestIndex, numDataPoints - 1));

    return {
      index: clampedIndex,
      points: data.datasets.map((dataset, idx) => ({
        datasetIndex: idx,
        value: dataset.data[clampedIndex],
        exerciseName: exerciseNames[idx],
      })),
    };
  };

  // Function used to handle the gesture to display the tooltip
  // Also used for the tap gesture to hide the tooltip
  const showTooltip = async ({ nativeEvent }) => {
    // Skip if the user is in edit mode
    if (isEditing) return;

    const gestureX = nativeEvent.x;
    const gestureY = nativeEvent.y;

    // Check if the gesture is within the chart bounds
    if (
      gestureX >= YAXIS_OFFSET &&
      gestureX <= chartWidth &&
      gestureY >= CHART_TOP_MARGIN &&
      gestureY <= chartHeight + CHART_TOP_MARGIN
    ) {
      const { index, points } = calculateClosestDataPoint(gestureX);

      const tooltipX =
        (index * (chartWidth - YAXIS_OFFSET)) /
          (data.datasets[0].data.length - 1) +
        YAXIS_OFFSET;
      setTooltip({
        visible: true,
        x: tooltipX,
        y: 220,
        values: points,
        index,
      });
    } else {
      // Hide tooltip if not within bounds
      if (tooltip.visible) {
        setTooltip({ ...tooltip, visible: false });
      }
    }
  };

  // Chart data
  const data = {
    // Don't display labels
    labels: [],
    // Data
    datasets: exerciseNames.map((exerciseName) => {
      return {
        data: filterLogs(exerciseName).map((log) => log.reps),
        color: (opacity = 1) => exerciseColours[exerciseName],
        strokeWidth: 2,
      };
    }),
    // Legend
    legend: exerciseNames,
  };

  // State to keep track of which line's dot we are currently rendering
  // It is indexed (0, n-1) with n being the number of exercises
  let lineIndex = -1;

  // Render dot
  const renderDot = (dot) => {
    // New exercise
    if (dot.index === 0) lineIndex++;

    // Reset to 0 when rerendering
    if (lineIndex === exerciseNames.length) lineIndex = 0;

    // Show larger dot only for active index
    const isActive = tooltip.visible && tooltip.index === dot.index;
    const size = isActive ? 6 : 0;

    return (
      <Circle
        key={`dot-${lineIndex}-${dot.index}`}
        cx={dot.x}
        cy={dot.y}
        r={size}
        fill={data.datasets[lineIndex].color()} // Get color from dataset
      />
    );
  };

  // Hide tooltip when user taps outside of the chart
  const handleOutsideTap = () => {
    if (tooltip.visible) {
      setTooltip({ ...tooltip, visible: false });
    }

    // Reset editing states
    setIsEditing(false);
    setNewExerciseValue(null);
    setExerciseIndex(null);
  };

  // State to handle if the user is editing a value
  const [isEditing, setIsEditing] = useState(false);
  const [newExerciseValue, setNewExerciseValue] = useState(null);
  const [exerciseIndex, setExerciseIndex] = useState(null);

  // Function to submit the edited value
  const handleEditSubmit = async (newValue) => {
    // Parse the new value
    const updatedValue = parseInt(newValue);

    if (isNaN(updatedValue) || exerciseIndex === null) return;

    // Get the specific exercise name and date for the selected index
    const selectedExercise = exerciseNames[exerciseIndex];
    // Get logs for the selected exercise
    const exerciseLogs = filterLogs(selectedExercise);
    // Get date for the selected index
    const selectedDate = exerciseLogs[tooltip.index]?.date;

    if (selectedDate) {
      // Update the value in the logs
      await updateLog("Ryan", selectedExercise, selectedDate, updatedValue);

      // Refresh logs
      _fetchLogs();

      // Reset editing states
      setIsEditing(false);
      setNewExerciseValue(null);
      setExerciseIndex(null);

      // Refresh tooltip
      setTooltip({
        ...tooltip,
        values: tooltip.values.map((point, idx) =>
          idx === exerciseIndex ? { ...point, value: updatedValue } : point
        ),
      });
    }
  };

  // Function to render Tooltip with editable fields
  const renderTooltip = () => {
    return (
      tooltip.visible && (
        <View
          style={[
            styles.tooltip,
            {
              left: tooltip.x + (tooltip.x > chartWidth / 2 ? -145 : 45),
              top: tooltip.y - 60,
            },
          ]}
        >
          {tooltip.values
            .filter((point) => point.value !== undefined) // Ensure value is defined
            .map((point, index) => (
              <View style={styles.sideBySide} key={index}>
                {/* Edit button */}
                <TouchableOpacity
                  style={styles.edit}
                  onPressIn={() => {
                    setIsEditing(true);
                    setNewExerciseValue(point.value.toString());
                    setExerciseIndex(index);
                  }}
                >
                  <Feather name="edit-2" size={20} color={Colours.text} />
                </TouchableOpacity>

                {/* Conditionally render Text or TextInput */}
                {isEditing && exerciseIndex === index ? (
                  <TextInput
                    value={newExerciseValue}
                    onChangeText={setNewExerciseValue}
                    onSubmitEditing={() => handleEditSubmit(newExerciseValue)}
                    style={[
                      styles.input,
                      { color: exerciseColours[point.exerciseName] },
                    ]}
                    keyboardType="numeric"
                    autoFocus
                  />
                ) : (
                  <Text style={{ color: exerciseColours[point.exerciseName] }}>
                    {point.exerciseName}: {point.value}
                  </Text>
                )}
              </View>
            ))}
        </View>
      )
    );
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <TouchableWithoutFeedback
        onPress={handleOutsideTap}
        style={styles.container}
      >
        <View style={styles.container}>
          {/* Title */}
          <Text style={styles.title}>Statistics</Text>

          {/* Shuffle Colours Button */}
          <TouchableOpacity
            style={styles.topButton}
            onPress={() => shuffleColours()}
          >
            <Text style={styles.topButtonText}>Shuffle Colours</Text>
          </TouchableOpacity>

          {/* Chart */}
          {loadingLogs ? (
            <ActivityIndicator />
          ) : (
            <TapGestureHandler onHandlerStateChange={showTooltip}>
              <PanGestureHandler onGestureEvent={showTooltip}>
                <View>
                  <LineChart
                    data={data}
                    width={chartWidth}
                    height={chartHeight}
                    chartConfig={{
                      backgroundGradientFrom: Colours.bg,
                      backgroundGradientTo: Colours.bg,
                      decimalPlaces: 0,
                      color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                      propsForDots: { r: "0", strokeWidth: "0" },
                    }}
                    bezier={false} // Non-smooth lines
                    fromZero={true}
                    withVerticalLines={false}
                    style={styles.chart}
                    renderDotContent={renderDot}
                  />

                  {/* Tooltip */}
                  {renderTooltip()}
                </View>
              </PanGestureHandler>
            </TapGestureHandler>
          )}

          {/* Back button */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons
              name="arrow-back-outline"
              size={28}
              color={Colours.text}
            />
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colours.bg,
    alignItems: "center",
  },
  title: {
    color: Colours.text,
    fontSize: 30,
    marginVertical: 45,
  },
  chart: {
    width: "100%",
    marginTop: CHART_TOP_MARGIN,
  },
  backButton: {
    position: "absolute",
    top: 45,
    left: 30,
    width: 45,
    height: 45,
    alignItems: "center",
    justifyContent: "center",
  },
  topButton: {
    backgroundColor: Colours.lightblue,
    padding: 15,
    borderRadius: 15,
    alignSelf: "flex-end",
    marginRight: 10,
  },
  topButtonText: {
    color: Colours.darkgrey,
  },
  tooltip: {
    position: "absolute",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    padding: 5,
    borderRadius: 5,
  },
  sideBySide: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
  },
  edit: {
    paddingHorizontal: 5,
    borderRadius: 5,
  },
  input: {
    backgroundColor: Colours.bg,
    borderColor: Colours.text,
    borderWidth: 1,
    padding: 5,
    borderRadius: 5,
    width: 60,
    color: Colours.text,
    fontSize: 14,
    textAlign: "center",
  },
});
