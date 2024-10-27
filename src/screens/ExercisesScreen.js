import { useEffect, useState } from "react";
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { createExercise, fetchExercises } from "../operations/Exercises";
import Colours from "../config/Colours";

export default function ExercisesScreen() {
  // Get exercises
  const [exercises, setExercises] = useState([]);

  useEffect(() => {
    fetchExercises(setExercises);
  }, []);

  // Add exercise modal
  const [addExerciseModalVisible, setAddExerciseModalVisible] = useState(false);

  // New name of exercise
  const [newExerciseName, setNewExerciseName] = useState("");

  const handleAddExercise = async () => {
    if (newExerciseName == "") {
        return;
    }

    setAddExerciseModalVisible(false);

    await createExercise(newExerciseName);

    // Refresh exercises
    await fetchExercises(setExercises);
  }

  // Render each exercise as a button
  const renderExerciseButton = ({ item }) => (
    <TouchableOpacity
      style={styles.exerciseButton}
      onPress={() => console.log(item.name)}
    >
      <Text style={styles.exerciseText}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Exercises</Text>
      <FlatList
        data={exercises}
        renderItem={renderExerciseButton}
        keyExtractor={(item) => item.id.toString()}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        numColumns={2}
        key="exerciseList"
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setAddExerciseModalVisible(true)}
      >
        <Text style={styles.addButtonText}>+ ADD</Text>
      </TouchableOpacity>

      {/* Modal for adding a new exercise */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={addExerciseModalVisible}
        onRequestClose={() => setAddExerciseModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create New Exercise</Text>
            <TextInput
              style={styles.input}
              placeholder="Exercise Name"
              value={newExerciseName}
              onChangeText={setNewExerciseName}
              placeholderTextColor={Colours.grey}
            />

            <View style={styles.sideBySide}>
                <TouchableOpacity style={styles.closeButton} onPress={() => setAddExerciseModalVisible(false)}>
                    <Text style={styles.closeButtonText}>Close</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.submitButton} onPress={handleAddExercise}>
                    <Text style={styles.submitButtonText}>Create</Text>
                </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colours.bg,
    alignItems: "center",
    paddingTop: 50,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colours.title,
    marginBottom: 20,
  },
  list: {
    width: "100%",
  },
  listContent: {
    paddingHorizontal: 20,
  },
  exerciseButton: {
    backgroundColor: Colours.buttonbg,
    borderColor: Colours.lightblue,
    borderWidth: 2,
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 20,
    margin: 10,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  exerciseText: {
    color: Colours.text,
    fontSize: 16,
    textAlign: "center",
  },
  addButton: {
    backgroundColor: Colours.blue,
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginTop: 20,
    alignItems: "center",
  },
  addButtonText: {
    color: Colours.text,
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: Colours.bg,
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: Colours.title,
  },
  input: {
    width: "100%",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    color: Colours.text,
  },
  submitButton: {
    backgroundColor: Colours.blue,
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  submitButtonText: {
    color: Colours.bg,
    fontSize: 16,
  },
  closeButton: {
    marginTop: 10,
    marginLeft: 10,
  },
  closeButtonText: {
    color: Colours.blue,
    fontSize: 16,
  },
  sideBySide: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 15,
  },
});
