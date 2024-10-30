import React, { useEffect, useMemo, useState } from 'react';
import { View, Dimensions, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import Colours from '../config/Colours';
import { StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from "@expo/vector-icons"
import { fetchLogs } from '../operations/ExerciseLog';
import { fetchExercises } from '../operations/Exercises';

const { width } = Dimensions.get('window');

export default function StatsScreen() {
    const navigation = useNavigation();

    // State for logs
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        const _fetchLogs = async () => {
            setLoadingLogs(true);
            await fetchLogs("Ryan", setLogs);
            setLoadingLogs(false);
        }
        _fetchLogs();
    }, [])

    // Loading for fetching logs
    // Note: Without this, the chart would cause an error trying to
    // render when the logs haven't been fetched yet.
    const [loadingLogs, setLoadingLogs] = useState(true);

    // State for exercises
    const [exerciseNames, setExerciseNames] = useState([]);

    useEffect(() => {
        fetchExercises((exercises) => {
            setExerciseNames(exercises.map(exercise => exercise.name));
        })
    }, [])

    // Function separating filtering list of logs for an exercise
    const filterLogs = (exerciseName) => {
        return logs.filter((log) => log.exercise === exerciseName)
            .map((log) => log.reps);
    }

    // Generate colours once per chart line
    const exerciseColors = useMemo(() => {
        return exerciseNames.reduce((acc, exerciseName) => {
            const r = Math.floor(Math.random() * 256);
            const g = Math.floor(Math.random() * 256);
            const b = Math.floor(Math.random() * 256);
            acc[exerciseName] = `rgba(${r}, ${g}, ${b}, 1)`;  // Fixed opacity
            return acc;
        }, {});
    }, [exerciseNames]); 

    // Example data
    const data = {
        // Don't display labels
        labels: [],
        // Data
        datasets: exerciseNames.map((exerciseName) => {
            return {
                data: filterLogs(exerciseName),
                color: (opacity = 1) => exerciseColors[exerciseName],
                strokeWidth: 2,
            }
        }),
        legend: exerciseNames,
    };

    return (
        <View style={styles.container}>
            {/* Title */}
            <Text style={styles.title}>
                Statistics
            </Text>

            {/* Chart */}
            {loadingLogs ? (
                <ActivityIndicator />
            ) : (
                <LineChart
                    data={data}
                    width={width - 20}
                    height={300}
                    chartConfig={{
                        backgroundGradientFrom: Colours.bg,
                        backgroundGradientTo: Colours.bg,
                        decimalPlaces: 0,
                        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                        propsForDots: {
                            r: "2",
                            strokeWidth: "0",
                        },
                    }}
                    bezier={false}  // Non-smooth lines
                    fromZero={true}
                    withVerticalLines={false}
                    // Enable tooltips with onDataPointClick
                    onDataPointClick={(data) => {
                        const { value, dataset, index } = data;
                        console.log(`Clicked point in dataset ${dataset} at index ${index}: ${value}`);
                        // You could also display a custom tooltip component here
                        alert(`Value: ${value}`);
                    }}
                    style={styles.graph}
                />
            )}

            {/* Back button */}
            <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
                >
                <Ionicons name="arrow-back-outline" size={28} color={Colours.text} />
            </TouchableOpacity>

        </View>
    )
};

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
    graph: {
        width: "100%",
        top: "15%",
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
})
