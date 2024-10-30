import { supabase } from "../lib/supabase";

export async function fetchLogs(personName, setLogs) {
  try {
    const { data, error } = await supabase
      .from("exerciselog")
      .select("*")
      .eq("person", personName)
      .order("date", { ascending: true });

    if (error) {
      alert(error.message);
      return;
    }

    setLogs(data);
  } catch (error) {
    alert(error.message);
  }
}

export async function createLog(personName, exerciseID, date, reps) {
  try {
    const { error } = await supabase.from("exerciselog").insert({
      person: personName,
      exercise: exerciseID,
      date,
      reps,
    });

    if (error) {
      alert(error.message);
      return;
    }
  } catch (error) {
    alert(error.message);
  }
}
