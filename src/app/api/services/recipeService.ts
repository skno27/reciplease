import { Sensitivity } from "@prisma/client";

// Mifflin-St Jeor method to calculate BMR

export const getRecipes = async (
  query: string,
  weight: string,
  height: string,
  age: string,
  activityLevel: string,
  gender: string,
  mealsPerDay: string = "3",
  includeIngredients: string,
  excludeIngredients: Sensitivity[]
) => {
  const addBMR = gender === "man" ? 5 : -161;
  const BMR =
    10 * parseFloat(weight) +
    6.25 * parseFloat(height) -
    5 * parseInt(age) +
    addBMR;

  const activityLevelNum = () => {
    switch (activityLevel) {
      case "SEDENTARY":
        return 1.2;
      case "LIGHT":
        return 1.375;
      case "MODERATE":
        return 1.55;
      case "VERY":
        return 1.725;
      case "SUPER":
        return 1.9;
      default:
        throw new Error("Invalid activity level");
    }
  };

  const calories = (BMR * activityLevelNum()) / parseInt(mealsPerDay);
  const protein = (calories * 0.2) / 4;
  const fat = (calories * 0.3) / 9;
  const carbs = (calories * 0.5) / 4;

  // ±20%
  const maxCalories = Math.round(calories * 1.2);
  const minCalories = Math.round(calories * 0.5);
  const minProtein = Math.round(protein * 0.5);
  const maxFat = Math.round(fat * 1.2);
  const minFat = Math.round(fat * 0.5);
  const maxCarbs = Math.round(carbs * 1.2);
  const minCarbs = Math.round(carbs * 0.5);

  // Build a comma-separated string from the excludeIngredients array
  let exclude = "";
  excludeIngredients.forEach((ing) => (exclude += ing.toLowerCase() + ","));
  if (exclude.length > 0) {
    // Remove the trailing comma
    exclude = exclude.slice(0, -1);
  }

  try {
    // Build the request URL with the calculated and provided parameters,
    // including addRecipeInformation=true
    const reqUrl =
      `query=${encodeURIComponent(query)}` +
      `&includeIngredients=${encodeURIComponent(includeIngredients)}` +
      `&maxCalories=${maxCalories}` +
      `&minCalories=${minCalories}` +
      `&minProtein=${minProtein}` +
      `&maxFat=${maxFat}` +
      `&minFat=${minFat}` +
      `&maxCarbs=${maxCarbs}` +
      `&minCarbs=${minCarbs}` +
      `&excludeIngredients=${encodeURIComponent(exclude)}` +
      `&addRecipeInformation=true` +
      `&addRecipeInstructions=true` +
      `&addRecipeNutrition=true` +
      `&apiKey=${process.env.SPOONACULAR_API_KEY}`;

    const url = `https://api.spoonacular.com/recipes/complexSearch?${reqUrl}`;
    console.log(`Req URL: ${url}`);
    const res = await fetch(url);
    if (!res.ok) {
      return null;
    }

    const recipes = await res.json();
    return recipes;
  } catch (err) {
    console.error("Calculation of nutrients Failed:", err);
  }
};
