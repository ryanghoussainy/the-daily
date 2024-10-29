import { supabase } from "../lib/supabase";

export async function fetchLogs(personName, setLogs) {
  try {
    const { data, error } = await supabase
      .from("exerciselog")
      .select("*")
      .eq("person", personName);

    if (error) {
      alert(error.message);
      return;
    }

    setLogs(data);
  } catch (error) {
    alert(error.message);
  }
}

export async function createLog(personID, exerciseID, date, reps) {
  try {
    const { data, error } = await supabase.from("exerciselog").insert({
      person: personID,
      exercise: exerciseID,
      date,
      reps,
    });

    if (error) {
      alert(error.message);
      return;
    }

    return data;
  } catch (error) {
    alert(error.message);
  }
}
