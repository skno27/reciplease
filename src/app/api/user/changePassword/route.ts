export const config = { runtime: "nodejs" };

import { changePassword } from "@/app/api/controllers/userController";
import { NextRequest, NextResponse } from "next/server";
import parseBody from "../../utils/parseBody";
import { PasswordUpdate } from "../../middlewares/schemas";
import { getIdFromRequest } from "../../services/userService";

export async function PATCH(req: NextRequest) {
  try {
    const userId = await getIdFromRequest(req);
    if (!userId) {
      return NextResponse.json(
        { error: "User ID is missing from the header" },
        { status: 401 }
      );
    }
    const body = await parseBody(req);
    const validationResult = PasswordUpdate.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Validation Failed", details: validationResult.error.issues },
        { status: 400 }
      );
    }
    const { password } = validationResult.data;
    if (!password) {
      return NextResponse.json(
        { error: "Password is missing" },
        { status: 401 }
      );
    }

    const message = await changePassword(userId, password);

    const res = NextResponse.json({ message }, { status: 200 });
    return res;
  } catch (err) {
    console.error("Error in the Change Password Route", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
