import { getRecipes } from "@/app/api/_services/recipeService";
import { NextRequest, NextResponse } from "next/server";
import prisma from "../services/prisma";
import { getIdFromRequest } from "../services/userService";

export async function GET(req: NextRequest) {
  const userId = await getIdFromRequest(req);
  if (!userId) {
    return NextResponse.json(
      { error: "Can't get the user id from the auth cookie" },
      { status: 401 }
    );
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    return NextResponse.json({ error: "User Not Found!" }, { status: 404 });
  }

  const mealsPerDay = "3";
  const weight = `${user.current_weight}`;
  const height = `${user.height}`;
  const age = `${user.age}`;
  const activityLevel = user.lifestyle;
  const gender = user.sex?.toLowerCase();
  const excludeIngredients = user.foodRestrictions;

  const url = new URL(req.url);
  console.log("URL:", url);
  const params = new URLSearchParams(url.searchParams);
  let includeIngredients = params.get("includeIngredients");
  let query = params.get("search") || "";

  if (!query) {
    query = "";
  }

  if (!includeIngredients) {
    includeIngredients = "";
  }

  try {
    const recipes = await getRecipes(
      query,
      weight,
      height,
      age,
      activityLevel!,
      gender!,
      mealsPerDay,
      includeIngredients,
      excludeIngredients
    );

    console.log("Recipes:", recipes);
    if (!recipes || recipes === null) {
      return NextResponse.json(
        { message: "Failed to fetch recipes" },
        { status: 400 }
      );
    }

    return NextResponse.json(recipes, { status: 200 });
  } catch (err) {
    console.error("Calculation of nutrients Failed:", err);
    return NextResponse.json(
      { message: `Failed to fetch recipes: ${err}` },
      { status: 400 }
    );
  }
}
