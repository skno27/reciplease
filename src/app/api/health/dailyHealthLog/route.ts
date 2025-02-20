import { NextRequest, NextResponse } from "next/server";
import parseBody from "../../utils/parseBody";
import { getIdFromRequest } from "../../services/userService";
import { DailyHealthLog } from "../../middlewares/schemas";
import { submitHealthLog } from "../../controllers/healthController";

export async function POST(req: NextRequest) {
  const userId = await getIdFromRequest(req);
  if (!userId) {
    return NextResponse.json(
      { error: "No id in header. User must log in" },
      { status: 500 }
    );
  }

  try {
    const body = await parseBody(req);
    const validationResult = DailyHealthLog.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validationResult.error.issues },
        { status: 400 }
      );
    }

    const { calories, protein } = body;

    if (!calories || !protein) {
      return NextResponse.json(
        { error: "No Calories or Protein sent in Request. At least send 0" },
        { status: 400 }
      );
    }
    const submitted = await submitHealthLog(userId, calories, protein);
    if (!submitted) {
      return NextResponse.json(
        { error: "Health Log Submission failed." },
        { status: 400 }
      );
    }
    return NextResponse.json({ status: 204 });
  } catch (err) {
    console.error("Failed to Post Daily Health Log", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
