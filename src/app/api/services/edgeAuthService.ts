// src/app/api/services/edgeAuthService.ts
import { jwtVerify, JWTVerifyResult } from "jose";

const secret = process.env.JWT_SECRET;
if (!secret) {
  throw new Error("JWT Secret is not found");
}

const encoder = new TextEncoder();

export const verifyTokenEdge = async (
  token: string
): Promise<JWTVerifyResult["payload"]> => {
  try {
    const { payload } = await jwtVerify(token, encoder.encode(secret));
    return payload;
  } catch (err) {
    if (err instanceof Error) {
      console.error("JWT Verification Error:", err.name, err.message);
      if (err.name === "JWTExpired") {
        throw new Error("Token has expired");
      } else if (err.name === "JWTInvalid") {
        throw new Error("Invalid token");
      }
    }
    throw new Error("Token verification failed");
  }
};
