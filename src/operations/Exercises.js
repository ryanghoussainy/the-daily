import { supabase } from "../lib/supabase";

export async function fetchExercises(setExercises) {
  try {
    const { data, error } = await supabase.from("exercises").select("*").order("name");

    if (error) {
      alert(error.message);
      return;
    }

    setExercises(data);
  } catch (error) {
    alert(error.message);
  }
}

export async function createExercise(name) {
  try {
    const { data, error } = await supabase.from("exercises").insert({ name });

    if (error) {
      alert(error.message);
      return;
    }

    return data;
  } catch (error) {
    alert(error.message);
  }
}

export async function updateExercise(id, name) {
  try {
    const { data, error } = await supabase
      .from("exercises")
      .update({ name })
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    return data;
  } catch (error) {
    alert(error.message);
  }
}

export async function deleteExercise(exerciseName) {
  try {
    const { data, error } = await supabase
      .from("exercises")
      .delete()
      .eq("name", exerciseName);

    if (error) {
      alert(error.message);
      return;
    }

    return data;
  } catch (error) {
    alert(error.message);
  }
}

export async function getExerciseName(exerciseID) {
  try {
    const { data, error } = await supabase
      .from("exercises")
      .select("name")
      .eq("id", exerciseID)
      .single();

    if (error) {
      alert(error.message);
      return;
    }

    return data;
  } catch (error) {
    alert(error.message);
  }
}
