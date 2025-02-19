import { handleHealthLog } from "../services/healthService";

export const submitHealthLog = async (
  userId: string,
  calories: string,
  protein: string
) => {
  const calorieValue = parseFloat(calories);
  const proteinValue = parseFloat(protein);

  const data = {
    caloriesIn: calorieValue,
    proteinIn: proteinValue,
  };

  const submitted = await handleHealthLog(userId, data);

  if (!submitted) {
    throw new Error("Couldn't Submit User Health Log");
  }
  return submitted;
};
