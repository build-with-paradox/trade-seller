import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { mongooseConnection } from "@/lib/mongoconnection";
import User from "@/models/Users";

const rateLimitMap = new Map<string, { count: number; timestamp: number }>();
const RATE_LIMIT_MAX_REQUESTS = 5; 
const RATE_LIMIT_TIME_FRAME = 60 * 1000;

export const handler = async (request: NextRequest) => {
  try {
    if (request.method !== "POST") {
      return NextResponse.json({ error: "Method Not Allowed" }, { status: 405 });
    }

    const { email, password }: { email: string; password: string } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const now = Date.now();
    const userRateData = rateLimitMap.get(email) || { count: 0, timestamp: now };
    
    if (userRateData.count >= RATE_LIMIT_MAX_REQUESTS && now - userRateData.timestamp < RATE_LIMIT_TIME_FRAME) {
      return NextResponse.json({ error: "Too many login attempts. Try again later." }, { status: 429 });
    }

    if (now - userRateData.timestamp > RATE_LIMIT_TIME_FRAME) {
      userRateData.count = 0;
      userRateData.timestamp = now;
    }

    userRateData.count += 1;
    rateLimitMap.set(email, userRateData);

    await mongooseConnection();

    const findUser = await User.findOne({ email }).select("-password");

    if (!findUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (findUser.role !== "admin") {
      return NextResponse.json({ error: "You are not authorized" }, { status: 403 });
    }

    const isPasswordValid = await bcrypt.compare(password, findUser.password);

    if (!isPasswordValid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = jwt.sign({ id: findUser._id, role: findUser.role }, process.env.JWT_SECRET!, {
      expiresIn: "7d", 
    });

    const response = NextResponse.json({ success: "Welcome to the dashboard" }, { status: 200 });

    response.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, 
    });

    return response;
  } catch (error: any) {
    console.error("Signup Error:", error);

    return NextResponse.json(
      { error: "Something went wrong", details: error.message },
      { status: 500 }
    );
  }
};
