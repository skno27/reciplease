import { NextRequest, NextResponse } from "next/server";
import parseBody from "../../utils/parseBody";
import { Goal } from "../../middlewares/schemas";
import { addHealthGoal } from "../../controllers/userController";
import prisma from "../../services/prisma";
import { getIdFromRequest } from "../../services/userService";

export async function POST(req: NextRequest) {
  const userId = await getIdFromRequest(req);
  if (!userId) {
    return NextResponse.json(
      { error: "No id in header. Please log in" },
      { status: 500 }
    );
  }
  try {
    const body = await parseBody(req);
    const validationResult = Goal.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validationResult.error.issues },
        { status: 400 }
      );
    }
    const { type, threshold } = validationResult.data;
    const submitted = await addHealthGoal(userId, type, threshold);

    if (!submitted) {
      return NextResponse.json(
        { error: "Goal Submission Failed" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { message: `Goal Submitted: ${submitted}` },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error in Creating New User Goal:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const userId = await getIdFromRequest(req);
  if (!userId) {
    return NextResponse.json(
      { error: "No id in header. Please log in" },
      { status: 500 }
    );
  }
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { goals: true },
    });
    if (!user || !user.goals) {
      console.error(
        "There was problem fetching the user or no goals were found"
      );
      return NextResponse.json(
        { error: "Unable to find user or user goals" },
        { status: 400 }
      );
    }
    return NextResponse.json({ currentGoals: user.goals }, { status: 200 });
  } catch (err) {
    console.error(
      "There was an Error while getting the user health goals:",
      err
    );
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
