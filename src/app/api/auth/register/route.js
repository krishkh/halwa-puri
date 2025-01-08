import { NextResponse } from "next/server";
import connectDB from "@/utils/db";
import Interviewee from "@/models/interviewee.model";
import Interviewer from "@/models/interviewer.model";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    await connectDB();
    const { type, ...userData } = await req.json();

    const Model = type === "interviewee" ? Interviewee : Interviewer;
    const user = new Model(userData);
    await user.save();

    const token = jwt.sign({ userId: user._id, type }, process.env.JWT_SECRET, {
      expiresIn: "24h",
    });

    return NextResponse.json({
      message: "Registration successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
