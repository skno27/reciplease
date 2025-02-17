import { NextRequest, NextResponse } from "next/server";
import prisma from "../services/prisma"; // Adjust import based on your setup

import { getIdFromRequest } from "../services/userService";

export async function POST(req: NextRequest) {
  const userId = await getIdFromRequest(req);
  if (!userId) {
    return NextResponse.json(
      { error: "No id in header. Please log in" },
      { status: 500 }
    );
  }

  try {
    const { caloriesIn, protein, water, date } = await req.json();

    if (caloriesIn === 0 && protein === 0 && water === 0) {
      return NextResponse.json({ message: "No data to save" }, { status: 200 });
    }

    // minor correction, so that the healthLog is created THROUGH the user on the database instead of just independently
    // may not be necessary, since we are using a NoSQL database --
    const entry = await prisma.user.update({
      where: { id: userId },
      data: {
        healthLogs: {
          create: {
            caloriesIn,
            protein,
            water,
            date: new Date(date),
          },
        },
      },
    });

    return NextResponse.json({ message: "Data saved", entry });
  } catch (error) {
    console.error("Error saving health data:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
